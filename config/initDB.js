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
}

export { applySchemas };
