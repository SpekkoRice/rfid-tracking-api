import * as Router from "koa-router";
export const router = new Router();

router.get("/tshirt/:rfid", async (ctx) => {
  ctx.body = {success: true};
});

router.get("/tshirt/:rfid/history", async (ctx) => {
  ctx.body = {success: true};
});

router.put("/tshirt/:rfid", async (ctx) => {
  ctx.body = {success: true};
});
