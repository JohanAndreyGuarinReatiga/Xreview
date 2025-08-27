import { getDB } from "../config/configdb.js";
import { Resenia } from "../models/Resenia.js";
import { ObjectId } from "mongodb";

export class ServicioResenias {
  static async crearResenia(data) {
    const db = getDB();
    const coleccionResenias = db.collection("resenia");
    const coleccionTitulos = db.collection("titulos");

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

    // Insertar la reseña
    const result = await coleccionResenias.insertOne(data);

    // 🔄 Recalcular estadísticas del título
    const estadisticas = await coleccionResenias
      .aggregate([
        { $match: { tituloId: data.tituloId } },
        {
          $group: {
            _id: "$tituloId",
            promedioCalificacion: { $avg: "$calificacion" },
            totalResenas: { $sum: 1 },
            meGusta: { $sum: { $size: "$meGusta" } },
            noMeGusta: { $sum: { $size: "$noMeGusta" } },
          },
        },
      ])
      .toArray();

    if (estadisticas.length > 0) {
      const stats = estadisticas[0];

      await coleccionTitulos.updateOne(
        { _id: data.tituloId },
        {
          $set: {
            "estadisticas.promedioCalificacion": stats.promedioCalificacion,
            "estadisticas.totalResenas": stats.totalResenas,
            "estadisticas.meGusta": stats.meGusta,
            "estadisticas.noMeGusta": stats.noMeGusta,
          },
        }
      );
    }

    return { ...data, _id: result.insertedId };
  }

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
