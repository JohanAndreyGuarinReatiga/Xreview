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
    const {titulo} = req.params;
    const servicio = new tituloServicio
    const resultado = await servicio.buscaPorNombre(titulo);
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

