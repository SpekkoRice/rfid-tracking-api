import * as Router from "koa-router";
import * as TShirt from "../models/tshirts";
export const router = new Router();

router.get("/tshirt/:rfid", async (ctx) => {
  const rfid = ctx.params.rfid
  try {
    const tshirt = await TShirt.getTshirtByRfid(rfid);
    ctx.body = tshirt;
  } catch (e) {
    ctx.status = 400;
    // Maybe show some error messages?
  }
});

router.get("/tshirt/:rfid/history", async (ctx) => {
  const rfid = ctx.params.rfid
  try {
    const tshirt = await TShirt.getTshirtByRfid(rfid);
    ctx.body = tshirt;
  } catch (e) {
    ctx.status = 400;
    // Maybe show some error messages?
  }
});

router.put("/tshirt/:rfid", async (ctx) => {
  const rfid = ctx.params.rfid
  const data = ctx.request.body;
  try {
    const tshirt = await TShirt.createTshirt({
      rfid: rfid,
      color: data.color,
      size: data.size,
      label: data.label
    });
    ctx.body = tshirt;
  } catch (e) {
    ctx.status = 400;
    // Maybe show some error messages?
  }
});
