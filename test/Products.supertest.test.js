import "dotenv/config";
import {expect} from "chai";
import mongoose from 'mongoose'
import supertest from 'supertest'

const requester = supertest("http://localhost:3000/api");

await mongoose.connect(process.env.MONGO_URL);
let cookie = {};

describe("Test CRUD de productos en la ruta api/products", function () {
    this.timeout(5000);

  it("Ruta: api/sessions/login con metodo POST", async function () {
        const user = {
            email: "jorge13@gmail.com",
            password: "lucas1"
        }

    const { _body, ok } = await requester.post("/sessions/login").send(user);
    cookie = _body.cookie;
    expect(ok).to.be.ok;
  });

  it("Ruta: api/products metodo Get", async () => {
    const { ok } = await requester.get("/products");

    expect(ok).to.be.ok;
  });

  it("Ruta: api/products/pid con método Get", async () => {
    const pid = "6544f809043834153a3a1c07";
    const { ok } = await requester.get(`/products/${pid}`);

    expect(ok).to.be.ok;
  });

  it("Ruta: api/products con método Post", async () => {
    const newProduct = {
      title: "Heladera",
      description: "heladera doble puerta",
      price: 140000,
      stock: 89,
      category: "frigo23f",
      code: "hel9239348434",
    };

    const response = await requester
      .post("/products")
      .send(newProduct)
      .set("Authorization", `Bearer ${cookie}`);

    expect(response).to.be.ok;
  });

  it("Ruta: api/products método Put", async () => {
    const pid = "6544f809043834153a3a1c07";
    const updateProduct = {
      title: "Heladera",
      description: "heladera doble puerta",
      price: 380000,
      stock: 52,
      category: "frigo23f",
      code: "hel9239348434",
    };

    const response = await requester
      .put(`/products/${pid}`)
      .send(updateProduct)
      .set("Authorization", `Bearer ${cookie}`);

    expect(response).to.be.ok;
  });

  it("Ruta: api/products/id método Delete", async () => {
    const pid = "6544f809043834153a3a1c07";

    const response = await requester
      .delete(`/products/${pid}`)
      .set("Authorization", `Bearer ${cookie}`);

    expect(response).to.be.ok;
  });

after(async () => {
    await mongoose.disconnect();
  });

});