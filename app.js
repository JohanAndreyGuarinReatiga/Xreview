// app.js
import express from "express";

const app = express();

// Middlewares básicos
app.use(express.json()); // Para recibir JSON en requests
app.use(express.urlencoded({ extended: true })); // Para recibir datos de formularios

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("🚀 API funcionando sin CORS");
});

// Aquí luego importarás tus rutas:
// import userRoutes from "./routes/users.js";
// app.use("/users", userRoutes);

export default app;
