import { randomUUID } from "node:crypto";

const usuariosIniciales = [
  {
    id: "usuario-jhon-mayta",
    email: "jhon.mayta@romaforte.bo",
    name: "Jhon Mayta",
    password: "romaforte123"
  }
];

const productosIniciales = [
  {
    id: "producto-rf-san-001",
    name: "Inodoro Roma Forte Siena",
    sku: "RF-SAN-001",
    price: 1280,
    stock: 5
  },
  {
    id: "producto-rf-lav-014",
    name: "Lavamanos Capri blanco",
    sku: "RF-LAV-014",
    price: 540,
    stock: 3
  }
];

export function createMemoryStore(seed = {}) {
  const usuarios = seed.users ?? usuariosIniciales;
  const productos = seed.products ?? productosIniciales;
  const usuariosPorId = new Map(usuarios.map((usuario) => [usuario.id, { ...usuario }]));
  const usuariosPorCorreo = new Map(
    usuarios.map((usuario) => [usuario.email.toLowerCase(), { ...usuario }])
  );
  const sesiones = new Map();
  const productosPorId = new Map(productos.map((producto) => [producto.id, { ...producto }]));

  return {
    findUserByEmail(email) {
      const usuario = usuariosPorCorreo.get(email);
      return usuario ? { ...usuario } : null;
    },

    createSession(userId) {
      const token = randomUUID();
      sesiones.set(token, userId);
      return token;
    },

    findUserByToken(token) {
      const userId = sesiones.get(token);
      const usuario = userId ? usuariosPorId.get(userId) : null;
      return usuario ? { ...usuario } : null;
    },

    listProducts() {
      return Array.from(productosPorId.values(), (producto) => ({ ...producto }));
    },

    findProductById(id) {
      const producto = productosPorId.get(id);
      return producto ? { ...producto } : null;
    },

    findProductBySku(sku) {
      const producto = Array.from(productosPorId.values()).find((item) => item.sku === sku);
      return producto ? { ...producto } : null;
    },

    createProduct(producto) {
      const guardado = { id: randomUUID(), ...producto };
      productosPorId.set(guardado.id, guardado);
      return { ...guardado };
    }
  };
}