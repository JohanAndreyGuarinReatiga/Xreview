import { getDB } from "../config/configdb.js";
import { ObjectId } from "mongodb";

export class tituloServicio {
  constructor() {
    this.collection = () => getDB().collection("titulos");
  }

  async crearTitulo(datos, usuario) {
    const nuevoTitulo = {
      titulo: datos.titulo,
      tipo: datos.tipo,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      anio: parseInt(datos.anio, 10),
      aprobado: false, // por defecto siempre falso
      creadoPor: new ObjectId(usuario._id), // usuario autenticado
      estadisticas: {
        promedioCalificacion: 0,
        sumaCalificaciones: 0,
        meGusta: 0,
        noMeGusta: 0,
        totalResenas: 0,
        ranking: 0,
      },
    };

    const res = await this.collection().insertOne(nuevoTitulo);
    return { mensaje: "✅ Título creado exitosamente", id: res.insertedId };
  }

  async listar(usuario) {
    let filtro = { aprobado: true };

    if (usuario?.rol === "administrador") {
      filtro = {}; // El admin ve todos
    }

    return await this.collection().find(filtro).toArray();
  }

  async buscarPorNombre(titulo) {
    const busqueda = await this.collection()
      .find({
        titulo: { $regex: new RegExp(titulo, "i") },
      })
      .toArray();

    if (!busqueda) throw new Error("Titulo no encontrado.");
    return busqueda;
  }

  async editar(id, datos, usuarioAutenticado) {
  if (!datos || Object.keys(datos).length === 0) {
    throw new Error("No se enviaron campos para actualizar");
  }

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

  async filtrado(filtros = {}) {
    const query = {};
    if (filtros.tipo) query.tipo = filtros.tipo;
    if (filtros.categoria) query.categoria = filtros.categoria;
    if (filtros.anio) query.anio = parseInt(filtros.anio);

    // 👇 Si no mandan nada, siempre mostrar aprobados
    if (filtros.aprobado === undefined) {
      query.aprobado = true;
    } else {
      query.aprobado = filtros.aprobado;
    }

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

  async buscarPorTexto(query) {
    return await this.collection()
      .find({ $text: { $search: query } })
      .toArray();
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

  async listarPorUsuario(usuarioId) {
    return await this.collection()
      .find({ creadoPor: new ObjectId(usuarioId) })
      .toArray();
  }
}
