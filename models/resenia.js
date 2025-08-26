// models/Resenia.js
import { ObjectId } from "mongodb";

export class Resenia {
  constructor({ tituloId, usuarioId, encabezado, comentario, calificacion }) {
    // Validaciones
    if (!tituloId || !(tituloId instanceof ObjectId)) {
      throw new Error("El campo 'tituloId' es obligatorio y debe ser un ObjectId válido.");
    }

    if (!usuarioId || !(usuarioId instanceof ObjectId)) {
      throw new Error("El campo 'usuarioId' es obligatorio y debe ser un ObjectId válido.");
    }

    if (!encabezado || typeof encabezado !== "string" || encabezado.length > 100) {
      throw new Error("El encabezado es obligatorio y debe tener máximo 100 caracteres.");
    }

    if (!comentario || typeof comentario !== "string" || comentario.length > 1000) {
      throw new Error("El comentario es obligatorio y debe tener máximo 1000 caracteres.");
    }

    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 10) {
      throw new Error("La calificación debe ser un número entero entre 1 y 10.");
    }

    // Asignación de valores
    this._id = new ObjectId();
    this.tituloId = tituloId;
    this.usuarioId = usuarioId;
    this.encabezado = encabezado;
    this.comentario = comentario;
    this.calificacion = calificacion;
    this.meGusta = []; // array de ObjectId de usuarios
    this.noMeGusta = []; // array de ObjectId de usuarios
  }

  //  Métodos de utilidad
  darLike(usuarioId) {
    if (!(usuarioId instanceof ObjectId)) {
      throw new Error("El ID del usuario debe ser un ObjectId válido.");
    }
    // Evita duplicados y elimina de noMeGusta si estaba allí
    this.meGusta = [...new Set([...this.meGusta, usuarioId])];
    this.noMeGusta = this.noMeGusta.filter((id) => !id.equals(usuarioId));
  }

  darDislike(usuarioId) {
    if (!(usuarioId instanceof ObjectId)) {
      throw new Error("El ID del usuario debe ser un ObjectId válido.");
    }
    // Evita duplicados y elimina de meGusta si estaba allí
    this.noMeGusta = [...new Set([...this.noMeGusta, usuarioId])];
    this.meGusta = this.meGusta.filter((id) => !id.equals(usuarioId));
  }

  toDBObject() {
    return {
      _id: this._id,
      tituloId: this.tituloId,
      usuarioId: this.usuarioId,
      encabezado: this.encabezado,
      comentario: this.comentario,
      calificacion: this.calificacion,
      meGusta: this.meGusta,
      noMeGusta: this.noMeGusta,
    };
  }
}
