import * as chai from "chai";
import * as moment from "moment";
import * as mocha from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as _ from "lodash";
import * as sinon from  "sinon";

import * as Box from "./box";
import * as TShirts from "./tshirts";

process.env.NODE_ENV = "test";

const assert = chai.assert;
let mongoServer: MongoMemoryServer;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

class ContextEx extends mocha.Context {
  sandbox: sinon.SinonSandbox;
}

describe("MODEL: Box", function() {

  before(async function(this: ContextEx) {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, { useNewUrlParser: true });
  });

  beforeEach(async function(this: ContextEx) {
    //
  });
  
  after(async function() {
    await mongoose.disconnect();
  });

  afterEach(async function(this: ContextEx) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      await collection.dropIndexes();
    }
  });

  it("Should create a box", async function() {
    const rfid = '123';
    const box = await Box.createBox(rfid);
    assert.equal(box.rfid, rfid);
  });

  it("Should return a box via rfid and associated tshirts", async function () {
    const rfid = '123';
    const createdBox = await Box.boxMongooseModel.create({rfid});
    const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
    await TShirts.tshirtsMongooseModel.create({
      pastLocations: [ll._id],
      rfid: '564',
      color: 'blue',
      label: 'nike-t-shirt',
      lastLocation: ll._id,
      boxId: createdBox._id,
      size: 'xl',
    });
    const box = await Box.getByRfid(rfid);
    assert.exists(box);
    assert.equal(box.rfid, rfid);
    assert.equal(box.tshirtRfids[0], '564');
  });

});