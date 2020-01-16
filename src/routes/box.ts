import * as Router from "koa-router";
import * as Box from "../models/box";
import * as TShirts from "../models/tshirts";
import * as _ from "lodash";
export const router = new Router();

router.get("/box/:rfid", async (ctx) => {
  const rfid = ctx.params.rfid;
  try {
    ctx.body = await Box.getByRfid(rfid);
  } catch (e) {
    ctx.status = 400;
    // Send some error info
  }
  
});

router.put("/box/:rfid", async (ctx) => {
  const rfid = ctx.params.rfid;
  const tshirtRfids = ctx.request.body.tshirtRfids; 
  try {
    const box = await Box.createBox(rfid);
    await Box.addBoxIdToTShirts(box._id, tshirtRfids);
    ctx.body = await Box.getByRfid(rfid);
  } catch (e) {
    ctx.status = 400;
    // Send some error information
  }
});