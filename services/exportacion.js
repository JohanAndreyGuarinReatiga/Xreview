import { getDB } from "../config/configdb";
import { ObjectId } from "mongodb";

export class Exportacion {
    async exportarResenas(tid) {
    const fs = require('fs/promises')

    const titulo = await getDB().collection("titulos").findOne({ _id: new ObjectId(tid) });
    if (!titulo) {
      throw new Error("no encontrado");
    }

    const resenias = await getDB().collection("resenia").find({ tituloId: new ObjectId(tid) }).toArray();
    if (resenias.length === 0) {
      throw new Error("no hay resenia");
    }

    const datos = resenias.map((resenia) => ({
      nombreusuario: resenia.usuario.nombre,
      calificacion: `${resenia.calificacion}/5`,
      comentario: resenia.comentario,
      fecha: resenia.fechaCreacion.toISOString(),
    }));


    fs.appendFile(archivo, datos);
    return archivo;
  }
}
