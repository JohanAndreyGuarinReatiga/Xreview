import { getDB } from "../config/configdb.js";
import { Resenia } from "../models/Resenia.js";
import { ObjectId } from "mongodb";

export class ServicioResenias {
  static async crearResenia(data) {
    const session = getDB().client.startSession();

    try {
      let nuevaResenia = new Resenia(data);

      let result;
      await session.withTransaction(async () => {
        result = await getDB()
          .collection("resenias")
          .insertOne(nuevaResenia.toDBObject(), { session });

        // recalcular promedio
        const stats = await getDB().collection("resenias").aggregate(
          [
            { $match: { tituloId: nuevaResenia.tituloId } },
            { $group: { _id: null, avgCalif: { $avg: "$calificacion" } } },
          ],
          { session }
        ).toArray();

        await getDB().collection("titulos").updateOne(
          { _id: nuevaResenia.tituloId },
          { $set: { promedioCalificacion: stats[0]?.avgCalif || nuevaResenia.calificacion } },
          { session }
        );
      });

      return { ...nuevaResenia.toDBObject(), insertedId: result.insertedId };
    } finally {
      await session.endSession();
    } }

    static async editarResenia(reseniaId, usuarioId, updates) {
    const resenia = await getDb().collection("resenias").findOne({ _id: new ObjectId(reseniaId) });
    if (!resenia) throw new Error("Reseña no encontrada");
    if (!resenia.usuarioId.equals(usuarioId)) throw new Error("No autorizado");

    const { encabezado, comentario, calificacion } = updates;

    await getDb().collection("resenias").updateOne(
      { _id: new ObjectId(reseniaId) },
      { $set: { encabezado, comentario, calificacion } }
    );

    return { _id: reseniaId, ...updates };
  }

}
