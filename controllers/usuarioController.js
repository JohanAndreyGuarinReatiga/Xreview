import { usuarioServicio } from "../services/usuarioServ.js";

const servicio = new usuarioServicio();

export async function registrar(req, res) {
  try {
    const resultado = await servicio.registrarUsarios(req.body);
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
    res.status(401).json({ error: err.mensaje });
  }
}

export async function listar(req, res) {
  try {
    const usuarios = await servicio.listar();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const resultado = await servicio.eliminar(id);
    res.json(resultado);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
