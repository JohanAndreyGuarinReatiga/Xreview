import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { configurePassport } from "./config/passport.js";
import authRoutes from "./routers/authRoutes.js";
import usuarioRoutes from "./routers/usuarioRoutes.js";
import reseniaRouter from "./routers/reseniaRouter.js";
import tituloRouter from "./routers/tituloRoutes.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";   
import { apiLimiter, loginLimiter } from "./middlewares/rateLimitMiddleware.js";

// 👇 usar createRequire para poder cargar JSON en ESM
const require = createRequire(import.meta.url);
const swaggerFile = require("./swagger-output.json");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar passport
app.use(passport.initialize());
configurePassport(passport);

// Rutas
app.use("/v1/auth", authRoutes, loginLimiter);
app.use("/v1/usuarios", usuarioRoutes, apiLimiter);
app.use("/v1/resenias", reseniaRouter, apiLimiter);
app.use("/v1/titulos", tituloRouter, apiLimiter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
