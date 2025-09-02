import { ObjectId } from "mongodb";

export class Titulo {
  constructor({
    titulo,
    tipo,
    descripcion,
    categoria,
    anio,
    imagenUrl = null,
    aprobado = false,
    creadoPor,
    estadisticas = {},
  }) {
    
    // Validaciones
    if (!titulo || typeof titulo !== "string" || titulo.length > 150) {
      throw new Error(
        "titulo' es obligatorio y debe ser un string válido (1-150 caracteres)."
      );
    }

    if (!["pelicula", "serie", "anime"].includes(tipo)) {
      throw new Error(
        "El tipo de pelicula debe ser 'pelicula' ,'serie' , 'anime'."
      );
    }

    if (!descripcion || descripcion.length < 10) {
      throw new Error("La descripcion debe ser una cadena.");
    }

    if (
      ![
        "Acción",
        "Drama",
        "Comedia",
        "Ciencia",
        "Ficción",
        "Terror",
        "Fantasía",
      ].includes(categoria)
    ) {
      throw new Error("La categoria debe ser 'accion', 'drama', etc");
    }

    if (!Number.isInteger(anio) || anio < 1000) {
      throw new Error("el anio debe ser un entero mayor o igual a 1800");
    }

    if (imagenUrl && !/^https:\/\/res\.cloudinary\.com\/.+/.test(imagenUrl)) {
      throw new Error("La 'imagenUrl' debe ser una URL válida de Cloudinary.");
    }

    if (typeof aprobado !== "boolean") {
      throw new Error("El campo 'aprobado' debe ser booleano");
    }

    if (!creadoPor || !(creadoPor instanceof ObjectId)) {
      throw new Error(
        "El campo 'creadoPor' debe ser un ObjectId válido de un usuario/admin."
      );
    }

    // Asignación de valores
    this._id = new ObjectId();
    this.titulo = titulo;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.anio = anio;
    this.imagenUrl = imagenUrl;
    this.aprobado = aprobado;
    this.creadoPor = creadoPor;
    this.estadisticas = {
      promedioCalificacion: estadisticas.promedioCalificacion ?? 0,
      meGusta: estadisticas.meGusta ?? 0,
      noMeGusta: estadisticas.noMeGusta ?? 0,
      totalResenas: estadisticas.totalResenas ?? 0,
      ranking: estadisticas.ranking ?? 0,
    };
  }

  // Conversión a objeto para MongoDB
  toDBObject() {
    return {
      _id: this._id,
      titulo: this.titulo,
      tipo: this.tipo,
      descripcion: this.descripcion,
      categoria: this.categoria,
      anio: this.anio,
      imagenUrl: this.imagenUrl,
      aprobado: this.aprobado,
      creadoPor: this.creadoPor,
      estadisticas: this.estadisticas,
    };
  }
}
