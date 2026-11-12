import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { createMemoryStore } from "../../src/memory-store.js";

const credentials = {
  email: "jhon.mayta@romaforte.bo",
  password: "romaforte123"
};

test("integración de la ruta de acceso con autenticación y almacén", async () => {
  const app = createApp({ store: createMemoryStore() });
  const response = await request(app).post("/api/auth/login").send(credentials).expect(200);

  assert.ok(response.body.token);
  assert.deepEqual(response.body.user, {
    id: "usuario-jhon-mayta",
    name: "Jhon Mayta",
    email: credentials.email
  });
});

test("integración de productos conserva la creación y la lectura en el almacén", async () => {
  const app = createApp({ store: createMemoryStore() });
  const login = await request(app).post("/api/auth/login").send(credentials).expect(200);
  const token = login.body.token;

  const created = await request(app)
    .post("/api/products")
    .set("Authorization", "Bearer " + token)
    .send({ name: "Grifería Verona", sku: "GRF-099", price: 460, stock: 8 })
    .expect(201);

  assert.equal(created.body.product.sku, "GRF-099");

  const list = await request(app)
    .get("/api/products")
    .set("Authorization", "Bearer " + token)
    .expect(200);

  assert.ok(list.body.products.some((product) => product.id === created.body.product.id));
});