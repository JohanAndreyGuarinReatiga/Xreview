import { query } from "express-validator";
import { tituloServicio } from "../services/titulosServ.js";

const servicio = new tituloServicio();

export async function crearTitulo(req, res) {
  try {
    const resultado = await servicio.crearTitulo({
      ...req.body,
      creadoPor: req.user.id,
    });
    res.status(201).json({ resultado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarTitulos(req, res) {
  try {
    const titulos = await servicio.listar(req.user);
    res.json(titulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function obtenerTitulo(req, res) {
  try {
    const { titulo } = req.params;
    const servicio = new tituloServicio();
    const resultado = await servicio.buscarPorNombre(titulo);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function editarTitulo(req, res) {
  try {
    const resultado = await servicio.editar(req.params.id, req.body, req.user);
    res.json(resultado);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}

export async function eliminarTitulo(req, res) {
  try {
    const resultado = await servicio.eliminar(req.params.id, req.user);
    res.json(resultado);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}

export async function aprobarTitulo(req, res) {
  try {
    const resultado = await servicio.aprobar(req.params.id, req.user);
    res.json(resultado);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
}

export async function listarConFiltros(req, res) {
  try {
    const filtro = await servicio.filtrado(req.query);
    res.json(filtro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listarTituloPaginado(req, res) {
  try {
    const { page, limit, sortBy, order } = query;
    const resultado = await servicio.listarPaginado({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || "anio",
      order: parseInt(order) || -1,
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function busquedaTexto(req, res) {
  try {
    const resultado = await servicio.buscarPorTexto(req.query.q);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function topRanking(req, res) {
  try {
    const resultado = await servicio.listarTopRanking(
      parseInt(req.query.limit) || 10
    );
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function masMeGustas(req, res) {
  try {
    const resultado = await servicio.listarMasGustados(
      parseInt(req, query.limit) || 10
    );
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listaDeUsuario(req, res) {
  try {
    const resultado = await servicio.listarPorUsuario(req.params.usuarioId);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//logica de estadisticas//
export async function darMeGusta(req, res) {
  try {
    const resultado = await servicio.meGusta(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function darNoMeGusta(req, res) {
  try {
    const resultado = await servicio.noMeGusta(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function calificarTitulo(req, res) {
  try {
    const { calificacion } = req.body;
    if (
      !typeof calificacion !== "number" ||
      calificacion < 1 ||
      calificacion > 10
    ) {
      return res
        .status(400)
        .json({ error: "La calificacion debe estar entre 1 y 10" });
    }

    const resultado = await servicio.calificar(req.params.id, calificacion);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deshacerlike(req, res) {
  try {
    const resultado = await servicio.quitarLike(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deshacerDislike(req, res) {
  try {
    const resultado = await servicio.quitarNoMeGusta(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}