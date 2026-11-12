import assert from "node:assert/strict";
import test from "node:test";
import { createAuthService } from "../../src/services/auth-service.js";
import { createProductService } from "../../src/services/product-service.js";
import { createMemoryStore } from "../../src/memory-store.js";

test("autenticación normaliza el correo, crea sesión y rechaza claves incorrectas", () => {
  const store = createMemoryStore();
  const auth = createAuthService(store);
  const credentials = { email: "jhon.mayta@romaforte.bo" };

  const session = auth.login({
    email: "  JHON.MAYTA@ROMAFORTE.BO ",
    password: "romaforte123"
  });

  assert.ok(session.token);
  assert.equal(session.user.name, "Jhon Mayta");
  assert.equal(session.user.email, credentials.email);
  assert.equal(auth.authenticate(session.token).id, "usuario-jhon-mayta");
  assert.throws(
    () => auth.login({ email: credentials.email, password: "incorrecta" }),
    (error) => error.statusCode === 401
  );
});

test("servicio de productos normaliza el SKU y rechaza duplicados o stock inválido", () => {
  const products = createProductService(createMemoryStore());

  const created = products.create({
    name: "  Grifería Verona ",
    sku: "  grf-099 ",
    price: 460,
    stock: 8
  });

  assert.equal(created.name, "Grifería Verona");
  assert.equal(created.sku, "GRF-099");
  assert.equal(products.get(created.id).stock, 8);
  assert.throws(
    () => products.create({ name: "Producto duplicado", sku: "grf-099", price: 25, stock: 1 }),
    (error) => error.code === "PRODUCT_SKU_EXISTS"
  );
  assert.throws(
    () => products.create({ name: "Sin stock válido", sku: "STK-100", price: 25, stock: -1 }),
    (error) => error.code === "INVALID_PRODUCT_STOCK"
  );
});