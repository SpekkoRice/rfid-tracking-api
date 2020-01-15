import * as _ from "lodash";
import * as mongoose from "mongoose";
import * as Box from "./box";

export interface ITshirtLocation extends mongoose.Document {
  _id: mongoose.Types.ObjectId,
  timestamp: string,
  location: string,
  tShirtId: mongoose.Types.ObjectId,
}

export interface ITshirt extends mongoose.Document {
  _id: mongoose.Types.ObjectId,
  color: string,
  size: string,
  label: string,
  rfid: string,
  lastLocation: mongoose.Types.ObjectId,
  pastLocations: mongoose.Types.ObjectId[],
  boxId: mongoose.Types.ObjectId,
}

export const tshirtsLocationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: () => { return new Date() },
  }
});

export const tshirtsSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
    index: true,
  },
  lastLocation: {
    type: mongoose.Types.ObjectId,
    ref: 'tshirtlocations',
  },
  boxId: {
    type: mongoose.Types.ObjectId,
    ref: 'box',
  },
  pastLocations: [{
    type: mongoose.Types.ObjectId,
    ref: 'tshirtlocations',
  }]
}, { timestamps: true});

const TshirtsLocation = mongoose.model<ITshirtLocation>("tshirtlocations", tshirtsLocationSchema);
const Tshirts = mongoose.model<ITshirt>("tshirts", tshirtsSchema);

export const tshirtsMongooseModel = Tshirts;
export const tshirtsLocationMongooseModel = TshirtsLocation;

export const createOrUpdate = async (lastLocation: string, tShirtData: Partial<ITshirt>) => {
  const locationData = {location: lastLocation};
  // Atomically create it if it doesn't exist
  const location = await TshirtsLocation.findOneAndUpdate(
    locationData,
    locationData,
    {upsert: true, new: true})
  .exec();
  // Add it to the last location
  tShirtData.lastLocation = location._id;
  return await Tshirts.findOneAndUpdate(
    {rfid: tShirtData.rfid},
    {...tShirtData, $push: {pastLocations: location._id}},
    {upsert: true, new: true})
  .populate('pastLocations');
};

export const createTshirt = async (tShirtData: Partial<ITshirt>) => {
  return createOrUpdate('Manufacturing', tShirtData);
};

export const updateLocation = async (location: string, rfid: string) => {
  return createOrUpdate(location, {rfid: rfid});
}

export const updateLocationByBox = async (location: string, rfid: string) => {
  const box = await Box.getByRfid(rfid);
  const tshirts = await Tshirts.find({boxId: box._id}).exec()
  const promises = [];
  _.each(tshirts, (tshirt) => {
    promises.push(updateLocation(location, tshirt.rfid))
  });
  return Promise.all(promises);
}

export const getTshirtByRfid = async (rfid: string) => {
  return await Tshirts.findOne({rfid: rfid}).populate('pastLocations').exec();
};

