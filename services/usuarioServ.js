import { getDB, ObjectId } from "mongodb";
import { Usuario } from "../models/usuarios";
import bcrypt from "bcrypt";

export class usuarioServicio {
  constructor() {
    this.collecion = () => getDB().collecion("usuarios");
  }

  // Crear usuario
  async registrarUsarios(datos) {
    const usuario = new Usuario(datos);

    //verifivar si ya existe el correo
    const existente = await this.collecion().findOne({ email: usuario.email });
    if (existente) throw new Error("El correo ya esta registrado");

    await this.collecion().insertOne(usuario.toDBObject());
    return { mensaje: "Usuario registrado con exito", usuarioId: usuario._id };
  }

  async login(email, contraseña) {
    const usuario = await this.collecion().findOne({ email: usuario.email });
    if (!usuario) throw new Error("Credenciales invalidas");

    const valido = bcrypt.compareSync(contraseña, usuario.contraseña);
    if (!valido) throw new Error("Credenciales invalidas");

    const token = JsonWebTokenError.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWR_SECRET,
      { expiresIn: "1h" }
    );

    return {
      mensaje: "Login exitoso",
      token,
      usuario: { id: usuario._id, apodo: usuario.apodo, rol: usuario.rol },
    };
  }

  async listar() {
    return await this.collecion().find().project({ contrase: 0 }).toArray();
  }

  async eliminar(id) {
    const res = await this.collecion().deleteOne({ _id: new ObjectId(id) });
    if (res.deleteCount === 0) throw new Error("Usuario no encontrado");
    return { mensaje: "Usuario eliminado" };
  }
}
