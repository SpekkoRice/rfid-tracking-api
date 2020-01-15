import * as Router from "koa-router";
import * as Box from "../models/box";
import * as TShirts from "../models/tshirts";
export const router = new Router();

router.post("/rfid/:rfid", async (ctx) => {
  const rfid = ctx.params.rfid
  const data = ctx.request.body;
  try {
    const box = await Box.getByRfid(rfid);
    if (box) {
      TShirts.updateLocationByBox(data.lastLocation, rfid);
    } else {
      TShirts.updateLocation(data.lastLocation, rfid);
    }
    ctx.status = 204;
  } catch (e) {
    ctx.body = 400
    // Could return some error stuff here
  }
});
