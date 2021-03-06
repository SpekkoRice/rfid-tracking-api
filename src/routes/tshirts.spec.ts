import * as chai from "chai";
import "chai-http";
import * as moment from "moment";
import * as mocha from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as _ from "lodash";
import * as sinon from  "sinon";
import * as app from "../app";
import * as TShirts from "../models/tshirts";

process.env.NODE_ENV = "test";

const assert = chai.assert;
let mongoServer: MongoMemoryServer;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

class ContextEx extends mocha.Context {
  sandbox: sinon.SinonSandbox;
}

describe("API: tshirts", function() {

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

  describe("GET /tshirt", function() {

    before(function() {
      //
    });

    beforeEach(function() {
      this.sandbox = sinon.createSandbox();
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it("should return tshirt by rfid", async function() {
      const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
      await TShirts.tshirtsMongooseModel.create({
        pastLocations: [ll._id],
        rfid: '123',
        color: 'blue',
        label: 'nike-t-shirt',
        lastLocation: ll._id,
        size: 'xl',
      });
      const agent = chai.request.agent(app.server);
      return agent
        .get("/tshirt/123")
        .then((res) => {
          assert.exists(res.body);
          assert.exists(res.body._id);
          assert.equal(res.body.rfid, '123');
          assert.equal(res.status, 200);
      });
    });

    it("should return tshirt and tshirt history by rfid", async function() {
      const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
      await TShirts.tshirtsMongooseModel.create({
        pastLocations: [ll._id],
        rfid: '123',
        color: 'blue',
        label: 'nike-t-shirt',
        lastLocation: ll._id,
        size: 'xl',
      });
      const agent = chai.request.agent(app.server);
      return agent
        .get("/tshirt/123/history")
        .then((res) => {
          assert.exists(res.body);
          assert.exists(res.body._id);
          assert.equal(res.body.rfid, '123');
          assert.equal(res.status, 200);
      });
    });
  });

  describe("PUT /tshirt", function() {

    before(function() {
      //
    });

    beforeEach(function() {
      this.sandbox = sinon.createSandbox();
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it("should add rfid tag to tshirt successfully", async function() {
      const agent = chai.request.agent(app.server);
      return agent
        .put("/tshirt/123")
        .send({
          color: 'blue',
          label: 'nike-t-shirt',
          size: 'xl',
        })
        .then((res) => {
          assert.exists(res.body);
          assert.exists(res.body._id);
          assert.equal(res.body.rfid, '123');
          assert.equal(res.status, 200);
      });
    });
  });

});
