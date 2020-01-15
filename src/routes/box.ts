import * as Router from "koa-router";
export const router = new Router();

router.get("/box/:_id", async (ctx) => {
  ctx.body = {success: true};
});

router.put("/box/:_id", async (ctx) => {
  ctx.body = {success: true};
});