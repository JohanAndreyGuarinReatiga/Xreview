import { ObjectId } from "mongodb";

export class Titulo {
  constructor({
    titulo,
    tipo,
    descripcion,
    categoria,
    anio,
    aprobado,
    creadoPor,
    creadoEn,
  }) {
    if (!titulo || typeof titulo !== "string") {
      throw new Error("El titulo debe ser una cadena");
    }

    if (!["pelicula", "serie", "anime"].includes(tipo)) {
      throw new Error(
        "El tipo de pelicula debe ser 'pelicula' ,'serie' , 'anime'."
      );
    }

    if (!descripcion || typeof descripcion !== "string") {
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

    if (typeof anio !== "number") {
    }
  }
}
