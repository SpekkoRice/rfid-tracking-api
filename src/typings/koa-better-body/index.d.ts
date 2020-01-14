declare module "koa-better-body" {
  module "koa" {
    export class Request {
      public body: any;
      public fields: any;
      public files: any;
    }
  }
  namespace koaBetterBody {
    interface Options {
      fields?: boolean | string,
      files?: boolean | string,
      multipart?: boolean,
      textLimit?: string,
      formLimit?: string,
      urlencodedLimit?: string,
      jsonLimit?: string,
      bufferLimit?: string,
      jsonStrict?: boolean,
      detectJSON?: any,
      strict?: boolean,
      onerror?: any,
      extendTypes?: any,
      IncomingForm?: any,
      handler?: any,
      querystring?: any,
      qs?: any,
      delimiter?: string,
      sep?: string,
      buffer?: boolean,
    }
  }
  import {Context} from "koa";
  function koaBetterBody(options?: koaBetterBody.Options): IterableIterator<Context>;
  export = koaBetterBody;
}