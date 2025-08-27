import { getDB } from "../config/configdb.js";
import { Resenia } from "../models/Resenia.js";
import { ObjectId } from "mongodb";

export class ServicioResenias {
  static async crearResenia(data) { const db = getDB();
    const coleccion = db.collection("resenia");
  
    // Conversión estricta de ObjectId
    data.tituloId = new ObjectId(data.tituloId);
    data.usuarioId = new ObjectId(data.usuarioId);
  
    // Asegurar arrays
    data.meGusta = Array.isArray(data.meGusta)
      ? data.meGusta.map((id) => new ObjectId(id))
      : [];
  
    data.noMeGusta = Array.isArray(data.noMeGusta)
      ? data.noMeGusta.map((id) => new ObjectId(id))
      : [];
  
    // Asegurar número entero para calificación
    data.calificacion = parseInt(data.calificacion);
  
    // Insertar
    const result = await coleccion.insertOne(data);
    return { ...data, _id: result.insertedId };}
  
    static async editarResenia(reseniaId, usuarioId, updates) {
    const resenia = await getDB().collection("resenias").findOne({ _id: new ObjectId(reseniaId) });
    if (!resenia) throw new Error("Reseña no encontrada");
    if (!resenia.usuarioId.equals(usuarioId)) throw new Error("No autorizado");

    const { encabezado, comentario, calificacion } = updates;

    await getDB().collection("resenias").updateOne(
      { _id: new ObjectId(reseniaId) },
      { $set: { encabezado, comentario, calificacion } }
    );

    return { _id: reseniaId, ...updates };
  }
    
}
