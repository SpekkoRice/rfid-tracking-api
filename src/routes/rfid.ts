import * as Router from "koa-router";
export const router = new Router();

router.post("/rfid/:rfid", async (ctx) => {
  ctx.body = {success: true};
});
