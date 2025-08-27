import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { configurePassport } from "./config/passport.js";
import authRoutes from "./routers/authRoutes.js";
import usuarioRoutes from "./routers/usuarioRoutes.js";
import reseniaRouter from "./routers/v1/reseniaRouter.js"

dotenv.config();

const app = express();
app.use(express.json());

// Inicializar passport
app.use(passport.initialize());
// configurePassport(passport);

// Rutas
app.use("/v1/auth", authRoutes);
app.use("/v1/usuarios", usuarioRoutes);
app.use("/resenias", reseniaRouter)

export default app;
