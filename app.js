import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { configurePassport } from "./config/passport.js";

import authRoutes from "./routers/authRoutes.js";
import usuarioRoutes from "./routers/usuarioRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Inicializar passport
app.use(passport.initialize());
configurePassport(passport);

// Rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);

export default app;
