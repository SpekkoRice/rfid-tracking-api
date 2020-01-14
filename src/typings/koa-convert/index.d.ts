declare module "koa-convert" {
  import * as Koa from "koa";
  namespace convert {}
  function convert(middleware: IterableIterator<Koa.Context>): Koa.Middleware
  export = convert;
}