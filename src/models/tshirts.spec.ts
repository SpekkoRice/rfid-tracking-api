import * as chai from "chai";
import * as moment from "moment";
import * as mocha from "mocha";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as _ from "lodash";
import * as sinon from  "sinon";

import * as TShirts from "./tshirts";
import * as Box from "./box";

process.env.NODE_ENV = "test";

const assert = chai.assert;
let mongoServer: MongoMemoryServer;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

class ContextEx extends mocha.Context {
  sandbox: sinon.SinonSandbox;
}

describe("MODEL: TShirts", function() {

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

  it("Should create a tshirt", async function() {
    const tshirt = await TShirts.createTshirt({
      color: "blue",
      size: "xl",
      label: "nike-t-shirt",
      rfid: "123"
    });
    const lastLocation = await TShirts.tshirtsLocationMongooseModel.findOne({location: 'Manufacturing'});
    assert.exists(lastLocation);
    assert.equal(tshirt.color, 'blue');
    assert.equal(tshirt.size, 'xl');
    assert.equal(tshirt.label, 'nike-t-shirt');
    assert.equal(tshirt.rfid, '123');
  });

  it("Should update the tshirt location", async function () {
    const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
    const inserted = await TShirts.tshirtsMongooseModel.create({
      pastLocations: [ll._id],
      rfid: '123',
      color: 'blue',
      label: 'nike-t-shirt',
      lastLocation: ll._id,
      size: 'xl',
    });
    const newLocation = 'England - London';
    const updated = await TShirts.updateLocation(newLocation, inserted.rfid);
    const lastLocation = await TShirts.tshirtsLocationMongooseModel.findOne({location: newLocation});
    assert.equal(updated.lastLocation.toHexString(), lastLocation._id.toHexString());
    assert.equal(updated.pastLocations.length, 2);
    assert.equal((<any>updated.pastLocations[1]).location, lastLocation.location);
  });

  it("Should update the tshirt location using boxId", async function () {
    const box = await Box.boxMongooseModel.create({rfid: '908'});
    const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
    await TShirts.tshirtsMongooseModel.create({
      pastLocations: [ll._id],
      rfid: '123',
      color: 'blue',
      label: 'nike-t-shirt',
      lastLocation: ll._id,
      size: 'xl',
      boxId: box._id,
    });
    const newLocation = 'England - London';
    const updated = await TShirts.updateLocationByBox(newLocation, box.rfid);
    const lastLocation = await TShirts.tshirtsLocationMongooseModel.findOne({location: newLocation});
    updated.forEach((t) => {
      assert.equal(t.pastLocations.length, 2);
      assert.equal(t.pastLocations[1].location, lastLocation.location);
    })
  });

  it("Should return a tshirt with locations populated", async function () {
    const ll = await TShirts.tshirtsLocationMongooseModel.create({location: 'Manufacturing'});
    const inserted = await TShirts.tshirtsMongooseModel.create({
      pastLocations: [ll._id],
      rfid: '123',
      color: 'blue',
      label: 'nike-t-shirt',
      lastLocation: ll._id,
      size: 'xl',
    });
    const tshirt = await TShirts.getTshirtByRfid(inserted.rfid);
    assert.equal(tshirt.lastLocation.toHexString(), ll._id.toHexString());
    assert.equal((<any>tshirt.pastLocations[0]).location, ll.location);
    assert.equal(tshirt._id.toHexString(), inserted._id.toHexString());
  });

});