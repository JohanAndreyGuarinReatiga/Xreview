import dotenv from "dotenv";
import { connect } from "./config/configdb.js";
import { applySchemas } from "./config/initDB.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connect(); // 🔗 Conexión a MongoDB
    await applySchemas(); // 📂 Aplica/crea colecciones con validación
    console.log("✅ Schemas aplicados correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error iniciando el servidor:", err);
  }
}

startServer();
