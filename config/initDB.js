import { connect, getDB } from "./configdb.js";
import schemas from "../models/schemas.js";
import bcrypt from "bcrypt"

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

  // Logica para crear un administrador
   try {
    const adminUser = {
      email: "Admin@example.com",
      password: "123456789",
      apodo: "superAdmin",
      rol: "administrador",
    };

    const usuariosCollection = db.collection("usuarios");
    const existingAdmin = await usuariosCollection.findOne({ email: adminUser.email });

    if (!existingAdmin) {
      // Hashear la contraseña antes de guardar
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);

      const newAdmin = {
        ...adminUser,
        password: hashedPassword,
      };

      await usuariosCollection.insertOne(newAdmin);
      console.log("✔️ Usuario administrador creado exitosamente");
    } else {
      console.log("🔄 El usuario administrador ya existe, omitiendo la creación.");
    }
  } catch (err) {
    console.error("❌ Error al crear el usuario administrador:", err);
  }
}

export { applySchemas };
