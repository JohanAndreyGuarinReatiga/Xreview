import { text } from "express";
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
//******************************//
  async listarConFiltros(filtros = {}) {
    const query = {};
    if (filtros.tipo) query.tipo = filtros.tipo;
    if (filtros.categoria) query.categoria = filtros.categoria;
    if (filtros.anio) query.anio = parseInt(filtros.anio);
    if (filtros.aprobado !== undefined) query.aprobado = filtros.aprobado;

    return await this.collection().find(query).toArray();
  }

  async listarPaginado({ page = 1, limit = 10, sortBy = "anio", order = -1 }) {
    return await this.collection()
      .find()
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
  }

  async actualizarEstadisticas(
    id,
    { meGusta = 0, noMeGusta = 0, calificacion = null }
  ) {
    const update = {};

    if (meGusta) update["estadisticas.meGusta"] = meGusta;
    if (noMeGusta) update["estadisticas.noMeGusta"] = noMeGusta;

    if (calificacion !== null) {
      update["estadisticas.promedioCalificacion"] = calificacion;
      update["estadisticas.totalResenas"] = 1;
    }

    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $inc: update }
    );

    if (res.matchedCount === 0) throw new Error("Titulo no encontrado");
    return { mensaje: "Estadisticas actualizadas" };
  }

  async buscarPorTexto(query) {
    return await this.collection().find({ $text: { $search: query } }).toArray;
  }

  async listarTopRanking(limit = 10) {
    return await this.collection()
      .find({ aprobado: true })
      .sort({ "estadisticas.ranking": -1 })
      .limit(limit)
      .toArray();
  }

  async listarMasGustados(limit = 10) {
    return await this.collection()
      .find({ aprobado: true })
      .sort({ "estadisticas.meGusta": -1 })
      .limit(limit)
      .toArray();
  }

  async listarPorUsuarios(usuarioId) {
    return await this.collection()
    .find({creadoPor: new ObjectId(usuarioId)})
    .toArray()
  }
}
