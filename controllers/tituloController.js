import { tituloServicio } from "../services/titulosServ.js";

const servicio = new tituloServicio();

export const crearTitulo = async (req, res) => {
  try {
    const { titulo, tipo, descripcion, categoria, anio } = req.body;

    // Validación mínima
    if (!titulo || !tipo || !descripcion || !categoria || !anio) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Crear el título
    const nuevoTitulo = await servicio.crearTitulo(
      { titulo, tipo, descripcion, categoria, anio },
      req.user // usuario autenticado
    );

    res.status(201).json(nuevoTitulo);
  } catch (error) {
    console.error("❌ Error en controller:", error);
    res.status(500).json({ error: "Error al crear el título" });
  }
};

export async function listarTitulos(req, res) {
  try {
    const titulos = await servicio.listar();
    res.json(titulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function obtenerTitulo(req, res) {
  try {
    const { titulo } = req.params;
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
    const { page, limit, sortBy, order } = req.query;
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
      parseInt(req.query.limit) || 10
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