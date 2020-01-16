import * as chai from "chai";
import "chai-http";
import * as moment from "moment";
import * as mocha from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as _ from "lodash";
import * as sinon from  "sinon";
import * as app from "../app";

import * as Box from "../models/box";
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

describe("API: box", function() {

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

  describe("GET /box", function() {

    before(function() {
      //
    });

    beforeEach(function() {
      this.sandbox = sinon.createSandbox();
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it("should retreive all tshirt rfids associated to box rfid", async function() {
      const boxRfid = "098";
      const box = await Box.boxMongooseModel.create({rfid: boxRfid});
      const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
      await TShirts.tshirtsMongooseModel.create({
        pastLocations: [ll._id],
        rfid: '567',
        color: 'blue',
        label: 'nike-t-shirt',
        lastLocation: ll._id,
        size: 'xl',
        boxId: box._id,
      });
      await TShirts.tshirtsMongooseModel.create({
        pastLocations: [ll._id],
        rfid: '123',
        color: 'blue',
        label: 'nike-t-shirt',
        lastLocation: ll._id,
        size: 'xl',
        boxId: box._id,
      });

      const agent = chai.request.agent(app.server);
      return agent
        .get(`/box/${boxRfid}`)
        .then((res) => {
          assert.exists(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.body.tshirtRfids.length, 2);
      });
    });
  });

  describe("PUT /box", function() {

    before(function() {
      //
    });

    beforeEach(function() {
      this.sandbox = sinon.createSandbox();
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it("should add all tshirts into box successfully", async function() {
      const boxRfid = "098";
      const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
      await TShirts.tshirtsMongooseModel.create({
        pastLocations: [ll._id],
        rfid: '567',
        color: 'blue',
        label: 'nike-t-shirt',
        lastLocation: ll._id,
        size: 'xl',
      });
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
        .put(`/box/${boxRfid}`)
        .send({
          tshirtRfids: ['123','567']
        })
        .then((res) => {
          assert.exists(res.body);
          assert.equal(res.status, 200);
          assert.equal(res.body.tshirtRfids.length, 2);
      });
    });
  });

});
