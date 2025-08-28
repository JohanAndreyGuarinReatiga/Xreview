import { getDB } from "../config/configdb.js";
import { Titulo } from "../models/titulos.js";
import { ObjectId } from "mongodb";

export class tituloServicio {
  constructor() {
    this.collection = () => getDB().collection("titulos");
  }

  async crearTitulo(datos) {
    const servicio = new Titulo(datos);

    await this.collection().insertOne(servicio.toDBObject());
    return { mensaje: "Titulo creado con exito", tituloId: servicio._id };
  }

  async listar() {
    let filtro = { aprobado: true };

    if (usuarioAutenticado && usuarioAutenticado.rol === "administrador") {
      filtro = {};
    }

    return await this.collection().find(filtro).toArray();
  }

  async buscaPorNombre(titulo) {
    const busqueda = await this.collection().find({
      titulo: { $regex: new RegExp(titulo, "i") },
    });

    if (!busqueda) throw new Error("Titulo no encontrado.");
    return busqueda;
  }

  async editar(id, datos, usuarioAutenticado) {
    if (
      usuarioAutenticado.rol !== "administrador" &&
      (!datos.creadoPor || usuarioAutenticado.id !== datos.creadoPor.toString())
    ) {
      throw new Error("No tienes permiso para editar este titulo");
    }

    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: datos }
    );

    if (res.matchedCount === 0) throw new Error("Titulo no encontrado");

    return { mensaje: "Titulo actualizado con exito." };
  }

  async eliminar(id, usuarioAutenticado) {
    if (usuarioAutenticado.rol !== "administrador") {
      throw new Error("No tienes permiso para eliminar este articulo");
    }

    const res = await this.collection().deleteOne({ _id: new ObjectId(id) });
    if (res.deletedCount === 0) throw new Error("Titulo no encontrado");

    return { mensaje: "TItulo eliminado" };
  }

  async aprobar(id, usuarioAutenticado) {
    if (usuarioAutenticado.rol !== "administrador") {
      throw new Error("No tienes permiso para aprobar títulos");
    }

    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { aprobado: true } }
    );

    if (res.matchedCount === 0) throw new Error("Título no encontrado");

    return { mensaje: "Título aprobado con éxito" };
  }
}
