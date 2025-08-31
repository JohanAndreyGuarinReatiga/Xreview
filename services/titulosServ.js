import { getDB } from "../config/configdb.js";
import { ObjectId } from "mongodb";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export class tituloServicio {
  constructor() {
    this.collection = () => getDB().collection("titulos");
  }

  async crearTitulo(datos, usuario, file) {
    let imagenUrl = null;

    // Subir imagen a Cloudinary si hay archivo
    if (file) {
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "titulos" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

      const result = await uploadStream();
      imagenUrl = result.secure_url;
    }

    const nuevoTitulo = {
      titulo: datos.titulo,
      tipo: datos.tipo,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      anio: parseInt(datos.anio, 10),
      imagenUrl: imagenUrl, // URL de Cloudinary
      aprobado: false, // por defecto
      creadoPor: new ObjectId(usuario.id), // usuario autenticado
      estadisticas: {
        promedioCalificacion: 0,
        meGusta: 0,
        noMeGusta: 0,
        totalResenas: 0,
        ranking: 0,
      },
    };

    const res = await this.collection().insertOne(nuevoTitulo);
    return { mensaje: "Título creado exitosamente", id: res.insertedId };
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

  //logica de estadisticas//

  async meGusta(id) {
    const titulo = await this.collection().findOne({ _id: new ObjectId(id) });
    if (!titulo) throw new Error("Titulo no encontrado");

    const meGusta = (titulo.estadisticas.meGusta || 0) + 1;
    const noMeGusta = titulo.estadisticas.noMeGusta || 0;
    const promedio = titulo.estadisticas.promedioCalificacion || 0;

    const nuevoRanking = promedio + meGusta * 0.2 - noMeGusta * 0.1;

    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "estadisticas.meGusta": meGusta,
          "estadisticas.ranking": nuevoRanking,
        },
      }
    );

    if (res.matchedCount === 0) throw new Error("Titulo no encontrado");
    return { mensaje: "Me gusta agregado" };
  }

  async noMeGusta(id) {
    const titulo = await this.collection().findOne({ _id: new ObjectId(id) });
    if (!titulo) throw new Error("Titulo no encontrado");

    const meGusta = titulo.estadisticas.meGusta || 0;
    const noMeGusta = (titulo.estadisticas.noMeGusta || 0) + 1;
    const promedio = titulo.estadisticas.promedioCalificacion || 0;

    const nuevoRanking = promedio + meGusta * 0.2 - noMeGusta * 0.1;

    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "estadisticas.noMeGusta": noMeGusta,
          "estadisticas.ranking": nuevoRanking,
        },
      }
    );

    if (res.matchedCount === 0) throw new Error("Titulo no encontrado");
    return { mensaje: "No me gusta agregado" };
  }

  async calificar(id, calificacion) {
    const titulo = await this.collection().findOne({ _id: new ObjectId(id) });
    if (!titulo) throw new Error("Titulo no encontrado");

    // Valores actuales
    const sumaActual = titulo.estadisticas.sumaCalificaciones || 0;
    const totalActual = titulo.estadisticas.totalResenas || 0;
    const meGusta = titulo.estadisticas.meGusta || 0;
    const noMeGusta = titulo.estadisticas.noMeGusta || 0;

    // Nuevos valores
    const nuevaSuma = sumaActual + calificacion;
    const nuevoTotal = totalActual + 1;
    const nuevoPromedio = nuevaSuma / nuevoTotal;

    // Ranking (puedes ajustar fórmula)
    const nuevoRanking = nuevoPromedio + meGusta * 0.2 - noMeGusta * 0.1;

    // Actualizar documento
    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "estadisticas.sumaCalificaciones": nuevaSuma,
          "estadisticas.totalResenas": nuevoTotal,
          "estadisticas.promedioCalificacion": nuevoPromedio,
          "estadisticas.ranking": nuevoRanking,
        },
      }
    );

    if (res.matchedCount === 0) throw new Error("Titulo no encontrado");
    return { mensaje: "Calificación agregada con éxito" };
  }

  async quitarLike(id) {
  const titulo = await this.collection().findOne({ _id: new ObjectId(id) });
  if (!titulo) throw new Error("Titulo no encontrado");

  if ((titulo.estadisticas.meGusta || 0) <= 0) {
    throw new Error("El título no tiene likes para quitar");
  }

  const meGusta = titulo.estadisticas.meGusta - 1;
  const noMeGusta = titulo.estadisticas.noMeGusta || 0;
  const promedio = titulo.estadisticas.promedioCalificacion || 0;

  const nuevoRanking = promedio + (meGusta * 0.2) - (noMeGusta * 0.1);

  const res = await this.collection().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        "estadisticas.meGusta": meGusta,
        "estadisticas.ranking": nuevoRanking,
      },
    }
  );

  if (res.matchedCount === 0)
    throw new Error("Título no encontrado o sin likes");

  return { mensaje: "Me gusta quitado" };
  }

  async quitarNoMeGusta(id) {
    const titulo = await this.collection().findOne({ _id: new ObjectId(id) });
  if (!titulo) throw new Error("Titulo no encontrado");

  if ((titulo.estadisticas.noMeGusta || 0) <= 0) {
    throw new Error("El título no tiene dislikes para quitar");
  }

  const meGusta = titulo.estadisticas.meGusta || 0;
  const noMeGusta = titulo.estadisticas.noMeGusta - 1;
  const promedio = titulo.estadisticas.promedioCalificacion || 0;

  const nuevoRanking = promedio + (meGusta * 0.2) - (noMeGusta * 0.1);

  const res = await this.collection().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        "estadisticas.noMeGusta": noMeGusta,
        "estadisticas.ranking": nuevoRanking,
      },
    }
  );

  if (res.matchedCount === 0)
    throw new Error("Título no encontrado o sin dislikes");

  return { mensaje: "No me gusta quitado" };
  }
}
