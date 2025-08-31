import { connect, getDB } from "./configdb.js";
import schemas from "../models/schemas.js";

async function applySchemas() {
  const db = getDB();

  for (const [collectionName, validator] of Object.entries(schemas)) {
    try {
      await db.command({
        collMod: collectionName,
        validator,
        validationLevel: "strict",
      });
      console.log(`✅ Validación aplicada a '${collectionName}'`);
    } catch (err) {
      if (err.codeName === "NamespaceNotFound") {
        await db.createCollection(collectionName, {
          validator,
          validationLevel: "strict",
        });
        console.log(`📂 Colección '${collectionName}' creada con validación`);
      } else {
        console.error(
          `⚠️ Error aplicando validación a '${collectionName}':`,
          err
        );
        throw err;
      }
    }
  }

  try {
    // Borrar índice previo
    await db.collection("titulos").dropIndex("TextoIndexTitulos");
    console.log("🗑️ Índice anterior eliminado");

    // Crear índice nuevo con categoria
    await db
      .collection("titulos")
      .createIndex(
        { titulo: "text", descripcion: "text", categoria: "text" },
        { name: "TextoIndexTitulos" }
      );
    console.log("📌 Índice de texto recreado con 'categoria'");
  } catch (err) {
    console.error("⚠️ Error al recrear índice:", err);
  }

  const indexes = await db.collection("titulos").indexes();
  console.log("📑 Índices actuales en 'titulos':", indexes);
}

export { applySchemas };
