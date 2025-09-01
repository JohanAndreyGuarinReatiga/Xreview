// /middlewares/rateLimitMiddleware.js

import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP en 15 minutos
  standardHeaders: true, // Devuelve la información del límite en los headers (RateLimit-Limit, RateLimit-Remaining)
  legacyHeaders: false, // Desactiva los headers X-RateLimit-*
  message: {
    message:
      "Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos.",
  },
});

// Puedes exportar el middleware globalmente
export { apiLimiter };

// También puedes exportar limitadores específicos si los necesitas
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Máximo 5 intentos fallidos de login por IP en una hora
  message: {
    message:
      "Demasiados intentos de inicio de sesión fallidos desde esta IP. Por favor, intente de nuevo en una hora.",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
});

export { loginLimiter };
