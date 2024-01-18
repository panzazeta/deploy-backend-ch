import "dotenv/config";
import mongoose from "mongoose";
import { userModel } from "../src/models/users.models.js";
import Assert from "assert";
import { beforeEach } from "mocha";

const assert = Assert.strict;

await mongoose.connect(process.env.MONGO_URL);

describe("Test CRUD de usuario en la ruta api/users", function () {
  // antes de arrancar todo el test
  before(() => {
    console.log("Iniciando el Test");
  });

  //antes de arracar cada uno de los test

  beforeEach(() => {
    console.log("Comienza el test");
  });

  it("Obtener todos los usuarios mediante el método Get", async () => {
    const users = await userModel.find();

    assert.strictEqual(Array.isArray(users), true);
  });

  it("Obtener un usuario mediante el método Get", async () => {
    const user = await userModel.findById("65438d78935099fa43b4f236");

    assert.strictEqual(typeof user, "object");
    assert.ok(user._id);
  });

  it("Crear un nuevo usuario mediante el método Post", async () => {
    const newuser = {
      first_name: "carlos 24",
      last_name: "gomeze",
      email: "prueba123@prueba.com",
      password: "@@@ojegijlf3332",
      age: 57,
    };

    const user = await userModel.create(newuser);

    assert.ok(user._id);
  });

  it("Actualizar un usuario mediante el método Put", async () => {
    const updateUser = {
      first_name: "Daniepol",
      last_name: "Torrese",
      email: "prueba3555@prueba.com",
      password: "@@@ojegijlf3332",
      age: 55,
    };

    const user = await userModel.findByIdAndUpdate(
      "6593e8ba0cbd97e07de6c2aa",
      updateUser
    );

    assert.ok(user._id);
  });

  it("Eliminar un usuario mediante el método Delete", async () => {
    const result = await userModel.findByIdAndDelete(
      "6543d6f529ca96844b782e85"
    );

    assert.strictEqual(typeof result, "object");
  });
});
