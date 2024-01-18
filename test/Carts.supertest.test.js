import "dotenv/config";
import {expect} from "chai";
import mongoose from 'mongoose'
import supertest from 'supertest'

const requester = supertest("http://localhost:3000/api");

await mongoose.connect(process.env.MONGO_URL);

describe("Test de carritos en la ruta api/carts", function () {
    this.timeout(5000);

  it("Ruta /api/carts/:cid con método DELETE", async function () {
    
    const cid = "65954973ee0b725ba1ff65cb";

    const response = await requester
    .delete(`/carts/${cid}`)
    expect(response).to.be.ok;
  });

after(async () => {
  await mongoose.disconnect();
});

});