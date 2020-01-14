import * as cors from "@koa/cors";
import * as Koa from "koa";
import * as koaBetterBody from "koa-better-body";
import * as convert from "koa-convert";
import * as mount from "koa-mount";
import * as mongoose from "mongoose";
import { Server } from "http";

let app: Koa;

const mongooseOptions = {
  poolSize: 10, // Maintain up to 10 socket connections
  reconnectInterval: 500, // Reconnect every 500ms
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0
};

/* istanbul ignore if  */
if (process.env.NODE_ENV === "production") mongooseOptions.useCreateIndex = false;

export let server: Server;

export const main = async () => {
  const PORT = process.env.PORT || 3000;
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rfid";

  await mongoose.connect(MONGODB_URI, mongooseOptions);

  app = new Koa(); 
  app.use(convert(cors({credentials: true})));
  app.keys = ['super-secret-key'];
  app.use(convert(koaBetterBody({fields: "body"})));
  app.use(async (ctx, next) => {
    ctx.session.visits = ctx.session.visits ? ctx.session.visits + 1 : 1;
    await next();
    return;
  });

  server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
}

if (!module.parent) main().then(console.log, console.log);
