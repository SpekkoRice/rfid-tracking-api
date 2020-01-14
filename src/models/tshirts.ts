import * as _ from "lodash";
import * as mongoose from "mongoose";

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
  lastLocation: string,
  pastLocations: ITshirtLocation[],
}

export const tshirtsLocationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  tShirtId: {
    type: mongoose.Types.ObjectId,
    ref: 'tshirts'
  },
  timestamp: {
    type: Number,
    default: () => { return new Date().getTime() },
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
  },
}, { timestamps: true});

const TshirtsLocation = mongoose.model<ITshirtLocation>("tshirtlocation", tshirtsLocationSchema);
const Tshirts = mongoose.model<ITshirt>("tshirts", tshirtsSchema);

export const tshirtsMongooseModel = Tshirts;
export const tshirtsLocationMongooseModel = TshirtsLocation;

export const createTshirt = async () => {};

export const addTshirtLocation = async () => {};

export const getTshirtByRfid = async () => {};

export const getTshirtHistoryByRfid = async () => {};



