import * as _ from "lodash";
import * as mongoose from "mongoose";

export interface IBox extends mongoose.Document {
  _id: mongoose.Types.ObjectId,
  rfid: string,
  tshirtRfids: string[],
}

export const boxSchema = new mongoose.Schema({
  rfid: {
    type: String,
    required: true,
    index: true,
  }
}, {toObject: { virtuals: true }, toJSON: { virtuals: true }});

boxSchema.virtual("tshirtRfids", {
  ref: "tshirts",
  localField: "_id",
  foreignField: "boxId",
  justOne: false,
});

const Box = mongoose.model<IBox>("box", boxSchema);

export const boxMongooseModel = Box;

export const createBox = async (rfid: string) => {
  return await Box.findOneAndUpdate({rfid}, {rfid}, {upsert: true, new: true}).exec();
};

export const getByRfid = async (rfid: string) => {
  const box = await Box.findOne({rfid}).populate('tshirtRfids').exec();
  const oBox = box.toObject();
  const rfids = box.tshirtRfids.map((t:any) => t.rfid);
  oBox.tshirtRfids = rfids;
  return oBox;
}

