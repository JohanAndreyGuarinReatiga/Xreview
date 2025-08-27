import { usuarioServicio } from "../services/usuarioServ.js";

const servicio = new usuarioServicio();

export async function registrar(req, res) {
  try {
    const resultado = await servicio.registrarUsuarios(req.body);
    res.status(201).json({resultado});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, contraseña } = req.body;
    const resultado = await servicio.login(email, contraseña);
    res.json(resultado);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export async function listarUsuario(req, res) {
  try {
    const usuarios = await servicio.listar();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const resultado = await servicio.eliminar(id);
    res.json(resultado);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
