import * as chai from "chai";
import "chai-http";
import * as moment from "moment";
import * as mocha from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as _ from "lodash";
import * as sinon from  "sinon";
import * as app from "../app";

process.env.NODE_ENV = "test";

const assert = chai.assert;
let mongoServer: MongoMemoryServer;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

class ContextEx extends mocha.Context {
  sandbox: sinon.SinonSandbox;
}

describe("API: rfid", function() {

  before(async function(this: ContextEx) {
    chai.use(require("chai-http"));
    chai.use(require("chai-mongo-doc"));
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    process.env.MONGODB_URI = mongoUri;
    await app.main();
  });

  beforeEach(async function(this: ContextEx) {
    //
  });
  
  after(async function() {
    await mongoose.disconnect();
    await app.server.close();
  });

  afterEach(async function(this: ContextEx) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      await collection.dropIndexes();
    }
  });

  describe("POST /rfid", function() {

    before(function() {
      //
    });

    beforeEach(function() {
      this.sandbox = sinon.createSandbox();
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it("should successfully tag something with a location payload", async function() {
      const agent = chai.request.agent(app.server);
      return agent
        .post("/rfid/1")
        .then((res) => {
          assert.exists(res.body);
          assert.equal(res.status, 200);
      });
    });
  });
});
