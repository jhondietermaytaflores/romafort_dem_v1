import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../../src/app.js";
import { createMemoryStore } from "../../src/memory-store.js";

const credentials = {
  email: "jhon.mayta@romaforte.bo",
  password: "romaforte123"
};

async function withRunningApi(callback) {
  const server = createServer(createApp({ store: createMemoryStore() }));

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const baseUrl = "http://127.0.0.1:" + address.port;

  try {
    return await callback(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function login(baseUrl) {
  const response = await fetch(baseUrl + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  assert.equal(response.status, 200);
  return response.json();
}

test("E2E: inicia sesión por HTTP y consulta el catálogo protegido", async () => {
  await withRunningApi(async (baseUrl) => {
    const session = await login(baseUrl);
    const response = await fetch(baseUrl + "/api/products", {
      headers: { Authorization: "Bearer " + session.token }
    });

    assert.equal(response.status, 200);
    assert.equal(session.user.name, "Jhon Mayta");
    const body = await response.json();
    assert.ok(body.products.length >= 2);
  });
});

test("E2E: inicia sesión, registra un producto y lo recupera por HTTP", async () => {
  await withRunningApi(async (baseUrl) => {
    const session = await login(baseUrl);
    const createdResponse = await fetch(baseUrl + "/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.token
      },
      body: JSON.stringify({
        name: "Set de ducha Siena",
        sku: "DUC-099",
        price: 780,
        stock: 6
      })
    });

    assert.equal(createdResponse.status, 201);
    const created = await createdResponse.json();

    const fetchedResponse = await fetch(baseUrl + "/api/products/" + created.product.id, {
      headers: { Authorization: "Bearer " + session.token }
    });

    assert.equal(fetchedResponse.status, 200);
    const fetched = await fetchedResponse.json();
    assert.equal(fetched.product.sku, "DUC-099");
    assert.equal(fetched.product.stock, 6);
  });
});