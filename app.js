import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routers/index.js";

const app = express();

app.use(cors());
app.use(express.json());

//  limit global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
});
app.use(limiter);

// montar rutas versionadas
app.use(router);

export default app;
