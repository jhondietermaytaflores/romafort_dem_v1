import express from "express";
import { createAuthService } from "./services/auth-service.js";
import { createProductService } from "./services/product-service.js";
import { createMemoryStore } from "./memory-store.js";
import { HttpError } from "./http-error.js";

export function createApp({ store = createMemoryStore() } = {}) {
  const app = express();
  const auth = createAuthService(store);
  const products = createProductService(store);

  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post("/api/auth/login", (request, response) => {
    response.json(auth.login(request.body));
  });

  function requireAuthentication(request, _response, next) {
    const authorization = request.get("authorization") ?? "";
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(new HttpError(401, "AUTHENTICATION_REQUIRED", "Inicia sesión para continuar."));
    }

    try {
      request.user = auth.authenticate(token);
      return next();
    } catch (error) {
      return next(error);
    }
  }

  app.get("/api/products", requireAuthentication, (_request, response) => {
    response.json({ products: products.list() });
  });

  app.get("/api/products/:id", requireAuthentication, (request, response) => {
    response.json({ product: products.get(request.params.id) });
  });

  app.post("/api/products", requireAuthentication, (request, response) => {
    response.status(201).json({ product: products.create(request.body) });
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "ROUTE_NOT_FOUND", message: "No se encontró la ruta solicitada." }
    });
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }

    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    const code = typeof error.code === "string" ? error.code : "INTERNAL_ERROR";
    const message = statusCode < 500 ? error.message : "Ocurrió un error interno.";

    return response.status(statusCode).json({ error: { code, message } });
  });

  return app;
}