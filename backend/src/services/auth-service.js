import { HttpError } from "../http-error.js";

function vistaPublica(usuario) {
  return {
    id: usuario.id,
    name: usuario.name,
    email: usuario.email
  };
}

export function createAuthService(store) {
  return {
    login({ email, password } = {}) {
      if (typeof email !== "string" || typeof password !== "string") {
        throw new HttpError(400, "INVALID_CREDENTIALS", "Ingresa correo y contraseña.");
      }

      const correoNormalizado = email.trim().toLowerCase();
      const usuario = store.findUserByEmail(correoNormalizado);

      if (!usuario || usuario.password !== password) {
        throw new HttpError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
      }

      const token = store.createSession(usuario.id);
      return { token, user: vistaPublica(usuario) };
    },

    authenticate(token) {
      if (typeof token !== "string" || token.length === 0) {
        throw new HttpError(401, "AUTHENTICATION_REQUIRED", "Inicia sesión para continuar.");
      }

      const usuario = store.findUserByToken(token);
      if (!usuario) {
        throw new HttpError(401, "INVALID_TOKEN", "La sesión no es válida.");
      }

      return vistaPublica(usuario);
    }
  };
}