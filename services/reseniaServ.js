import { getDB } from "../config/configdb.js";
import { Resenia } from "../models/resenia.js";
import { ObjectId } from "mongodb";
import { Int32, Double } from "mongodb"; 

export class ServicioResenias {
  static async crearResenia(data) {
    const db = getDB();
    const coleccionResenias = db.collection("resenia");
    const coleccionTitulos = db.collection("titulos");

    // Conversión estricta de ObjectId
    data.tituloId = new ObjectId(data.tituloId);

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

    await this.crearnotificacion(notificaciones.reseniaId)

    return { ...data, _id: result.insertedId };
  }

  static async editarResenia(reseniaId, usuarioId, data) {
    const db = getDB();
    const coleccion = db.collection("resenia");
    const titulosCol = db.collection("titulos");
  
    if (!ObjectId.isValid(reseniaId)) {
      throw new Error("ID de reseña inválido");
    }
  
    const _id = new ObjectId(reseniaId);
  
    // Buscar reseña del usuario
    const reseniaExistente = await coleccion.findOne({ _id, usuarioId: new ObjectId(usuarioId) });
    if (!reseniaExistente) {
      throw new Error("Reseña no encontrada o no tienes permisos");
    }
  
    const updateData = {};
    if (data.encabezado) updateData.encabezado = data.encabezado;
    if (data.comentario) updateData.comentario = data.comentario;
    if (data.calificacion) updateData.calificacion = parseInt(data.calificacion);
  
    await coleccion.updateOne({ _id }, { $set: updateData });
  
    // Recalcular stats si cambió calificación
    if (data.calificacion) {
      const tituloId = reseniaExistente.tituloId;
  
      const stats = await coleccion
        .aggregate([
          { $match: { tituloId } },
          {
            $group: {
              _id: "$tituloId",
              promedioCalificacion: { $avg: "$calificacion" },
              totalResenas: { $sum: 1 },
            },
          },
        ])
        .toArray();
  
      if (stats.length > 0) {
        await titulosCol.updateOne(
          { _id: tituloId },
          {
            $set: {
              "estadisticas.promedioCalificacion": stats[0].promedioCalificacion,
              "estadisticas.totalResenas": stats[0].totalResenas,
            },
          }
        );
      }
    }
  
    return await coleccion.findOne({ _id });
  }
  
  static async eliminarResenia(reseniaId, rolUsuario, usuarioId) {
    if (!ObjectId.isValid(reseniaId)) {
      throw new Error("ID de reseña inválido");
    }
    const db = getDB();
    const reseña = await db.collection("resenia").findOne({ _id: new ObjectId(reseniaId) });
    if (!reseña) throw new Error("Reseña no encontrada");
    if (reseña.usuarioId.toString() !== usuarioId.toString() && rolUsuario !== "administrador") {
      throw new Error("No tienes permisos para eliminar esta reseña");
    }
    await db.collection("resenia").deleteOne({ _id: new ObjectId(reseniaId) });
  
    // Recalcular estadísticas del título
    const tituloId = reseña.tituloId; 
    const resenasRestantes = await db.collection("resenia").find({ tituloId }).toArray();
  
    let promedio = 0, meGusta = 0, noMeGusta = 0;
    if (resenasRestantes.length > 0) {
      promedio = resenasRestantes.reduce((acc, r) => acc + (r.calificacion || 0), 0) / resenasRestantes.length;
      meGusta = resenasRestantes.filter(r => r.meGusta === true).length;
      noMeGusta = resenasRestantes.filter(r => r.noMeGusta === true).length;
    }
  
    await db.collection("titulo").updateOne(
      { _id: new ObjectId(tituloId) },
      {
        $set: {
          "estadisticas.promedioCalificacion": promedio,
          "estadisticas.meGusta": meGusta,
          "estadisticas.noMeGusta": noMeGusta,
          "estadisticas.totalResenas": resenasRestantes.length
        }
      }
    );
  
    return { success: true };
  }

 static async likeResenia(reseniaId, usuarioId) {
    if (!ObjectId.isValid(reseniaId)) throw new Error("ID inválido");

    const db = getDB();
    const resenia = await db.collection("resenia").findOne({ _id: new ObjectId(reseniaId) });
    if (!resenia) throw new Error("Reseña no encontrada");

    // Remover dislike si existe y agregar like
    await db.collection("resenia").updateOne(
      { _id: new ObjectId(reseniaId) },
      {
        $addToSet: { meGusta: usuarioId },
        $pull: { noMeGusta: usuarioId }
      }
    );

    // Recalcular estadísticas del título
    await this._actualizarEstadisticasTitulo(resenia.tituloId);

    return { success: true };
  }

  static async dislikeResenia(reseniaId, usuarioId) {
    if (!ObjectId.isValid(reseniaId)) throw new Error("ID inválido");

    const db = getDB();
    const resenia = await db.collection("resenia").findOne({ _id: new ObjectId(reseniaId) });
    if (!resenia) throw new Error("Reseña no encontrada");

    // Remover like si existe y agregar dislike
    await db.collection("resenia").updateOne(
      { _id: new ObjectId(reseniaId) },
      {
        $addToSet: { noMeGusta: usuarioId },
        $pull: { meGusta: usuarioId }
      }
    );

    // Recalcular estadísticas del título
    await this._actualizarEstadisticasTitulo(resenia.tituloId);

    return { success: true };
  }

  // metodo privado para actualizar estadísticas
  static async _actualizarEstadisticasTitulo(tituloId) {
  const db = getDB();

  // Todas las reseñas del título
  const reseñas = await db
    .collection("resenia")
    .find({ tituloId: new ObjectId(tituloId) })
    .toArray();

  if (!reseñas.length) return;

  const totalResenas = reseñas.length;

  // Calculos
  const sumaCalificaciones = reseñas.reduce((sum, r) => sum + (r.calificacion || 0), 0);
  const promedioCalificacion = sumaCalificaciones / totalResenas;
  const meGusta = reseñas.reduce((sum, r) => sum + (r.meGusta?.length || 0), 0);
  const noMeGusta = reseñas.reduce((sum, r) => sum + (r.noMeGusta?.length || 0), 0);

  // Definir un ranking básico (puedes ajustar la fórmula)
  const ranking = (promedioCalificacion * 2) + (meGusta - noMeGusta);

  await db.collection("titulos").updateOne(
    { _id: new ObjectId(tituloId) },
    {
      $set: {
        "estadisticas.promedioCalificacion": new Double(promedioCalificacion),
        "estadisticas.sumaCalificaciones": new Int32(sumaCalificaciones),
        "estadisticas.meGusta": new Int32(meGusta),
        "estadisticas.noMeGusta": new Int32(noMeGusta),
        "estadisticas.totalResenas": new Int32(totalResenas),
        "estadisticas.ranking": new Double(ranking)
      }
    }
  )
}

static async listarResenias() {
  const db = getDB();
  
    const resenias = await db.collection("resenia").aggregate([
      {
        $lookup: {
          from: "usuarios",
          localField: "usuarioId",
          foreignField: "_id",
          as: "usuario"
        }
      },
      { $unwind: "$usuario" }
    ]).toArray();

    return resenias;
  }
  
//*************Examen**************//
  static async crearnotificacion(resenia) {
    const db = getDB();
    const coleccionNotificaciones = db.colleccion("notificaciones")
  
    const NuevaNotificacion = {
      creadoPor: new ObjectId(usuarioId._id),
      reseñaCreada: new ObjectId(resenia._id),
      fechaCreacion: new DateTime(),
      Estado: false
    } 
  
    const res = await coleccionNotificaciones.insertOne(NuevaNotificacion)
  
    return { mensaje: "El usuario agrego una nueva reseña", id: res.insertedId}
  }
}
