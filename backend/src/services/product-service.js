import { HttpError } from "../http-error.js";

export function createProductService(store) {
  return {
    list() {
      return store.listProducts();
    },

    get(id) {
      const producto = store.findProductById(id);
      if (!producto) {
        throw new HttpError(404, "PRODUCT_NOT_FOUND", "No se encontró el producto.");
      }
      return producto;
    },

    create(input = {}) {
      const name = typeof input.name === "string" ? input.name.trim() : "";
      const sku = typeof input.sku === "string" ? input.sku.trim().toUpperCase() : "";
      const price = input.price;
      const stock = input.stock;

      if (name.length < 2 || name.length > 120) {
        throw new HttpError(400, "INVALID_PRODUCT_NAME", "El nombre debe tener entre 2 y 120 caracteres.");
      }
      if (!/^[A-Z0-9-]{3,32}$/u.test(sku)) {
        throw new HttpError(400, "INVALID_PRODUCT_SKU", "El SKU debe tener entre 3 y 32 caracteres válidos.");
      }
      if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        throw new HttpError(400, "INVALID_PRODUCT_PRICE", "El precio debe ser un número igual o mayor que cero.");
      }
      if (!Number.isInteger(stock) || stock < 0) {
        throw new HttpError(400, "INVALID_PRODUCT_STOCK", "El stock debe ser un entero igual o mayor que cero.");
      }
      if (store.findProductBySku(sku)) {
        throw new HttpError(409, "PRODUCT_SKU_EXISTS", "Ya existe un producto con ese SKU.");
      }

      return store.createProduct({ name, sku, price, stock });
    }
  };
}