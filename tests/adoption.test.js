import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { expect } from "chai";
import request from "supertest";
import express from "express";

import createAdoptionRouter from "../src/routes/adoption.router.js";
import adoptionsController from "../src/controllers/adoptions.controller.js";
import adoptionModel from "../src/dao/models/Adoption.js";

import userModel from "../src/dao/models/User.js";
import petModel from "../src/dao/models/Pet.js";

let app;
let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // app con rutas reales
  app = express();
  app.use(express.json());
  app.use("/api/adoptions", createAdoptionRouter(adoptionsController));
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await adoptionModel.deleteMany();
  await userModel.deleteMany();
  await petModel.deleteMany();

  const testUser = await userModel.create({
    first_name: "Renzo",
    last_name: "Balestrero",
    email: "renzo@mail.com",
    password: "123456",
    pets: [],
  });

  const testPet = await petModel.create({
    name: "Firulais",
    specie: "Perro",
    adopted: false,
  });

  await adoptionModel.create({
    owner: testUser._id,
    pet: testPet._id,
  });
});

describe("POST /api/adoptions/:uid/:pid", () => {
  let testUser, testPet;

  beforeEach(async () => {
    await adoptionModel.deleteMany();
    await userModel.deleteMany();
    await petModel.deleteMany();

    testUser = await userModel.create({
      first_name: "Renzo",
      last_name: "Balestrero",
      email: "renzo@mail.com",
      password: "123456",
      pets: [],
    });

    testPet = await petModel.create({
      name: "Firulais",
      specie: "Perro",
      adopted: false,
    });
  });

  it(' GET /api/adoptions debería devolver las adopciones', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an('array');
  });

  it(" Debería crear una adopción correctamente", async () => {
    const res = await request(app).post(
      `/api/adoptions/${testUser._id}/${testPet._id}`
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Pet adopted");

    const updatedPet = await petModel.findById(testPet._id);
    expect(updatedPet.adopted).to.equal(true);

    const updatedUser = await userModel.findById(testUser._id);
    expect(updatedUser.pets.map((id) => id.toString())).to.include(
      testPet._id.toString()
    );
  });

  it(" Debería fallar si el usuario no existe", async () => {
    const fakeUid = new mongoose.Types.ObjectId();
    const res = await request(app).post(
      `/api/adoptions/${fakeUid}/${testPet._id}`
    );

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "user Not found");
  });

  it(" Debería fallar si la mascota no existe", async () => {
    const fakePid = new mongoose.Types.ObjectId();
    const res = await request(app).post(
      `/api/adoptions/${testUser._id}/${fakePid}`
    );

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Pet not found");
  });

  it(" Debería fallar si la mascota ya está adoptada", async () => {
    // marcar la mascota como ya adoptada
    testPet.adopted = true;
    await testPet.save();

    const res = await request(app).post(
      `/api/adoptions/${testUser._id}/${testPet._id}`
    );

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error", "Pet is already adopted");
  });

  it(" Debería fallar si falta el parámetro UID", async () => {
    const res = await request(app).post(`/api/adoptions//${testPet._id}`);
    expect(res.status).to.be.oneOf([404, 400]);
  });

  it(" Debería fallar si falta el parámetro PID", async () => {
    const res = await request(app).post(`/api/adoptions/${testUser._id}/`);
    expect(res.status).to.be.oneOf([404, 400]);
  });
});
