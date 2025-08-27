import { getDB } from "../config/configdb.js";
import { Usuario } from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export class usuarioServicio {
  constructor() {
    this.collection = () => getDB().collection("usuarios");
  }

  // Crear usuario
  async registrarUsuarios(datos) {
    const usuario = new Usuario(datos);

    //verifivar si ya existe el correo
    const existente = await this.collection().findOne({ email: usuario.email });
    if (existente) throw new Error("El correo ya esta registrado");

    usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10);

    await this.collection().insertOne(usuario.toDBObject());
    return { mensaje: "Usuario registrado con exito", usuarioId: usuario._id };
  }

  async login(email, contraseña) {
    const usuario = await this.collection().findOne({ email });
    if (!usuario) throw new Error("Credenciales invalidas");

    const valido = bcrypt.compareSync(contraseña, usuario.contraseña);
    if (!valido) throw new Error("Credenciales invalidas");

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      mensaje: "Login exitoso",
      token,
      usuario: { id: usuario._id, apodo: usuario.apodo, rol: usuario.rol },
    };
  }

  async listar() {
    return await this.collection().find().project({ contraseña: 0 }).toArray();
  }

  async eliminar(id) {
    const res = await this.collection().deleteOne({ _id: new ObjectId(id) });
    if (res.deletedCount === 0) throw new Error("Usuario no encontrado");
    return { mensaje: "Usuario eliminado" };
  }
}
