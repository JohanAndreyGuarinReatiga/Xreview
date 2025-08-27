import { ObjectId } from "mongodb";
import  bcrypt  from "bcrypt";

export class Usuario {
  constructor({ email, contraseña, apodo, rol }) {
    // Validaciones

    if (!email || !/^.+@.+\..+$/.test(email)) {
      throw new Error("El email es obligatorio y debe tener un formato valido.");
    }

    if (!contraseña || typeof contraseña !== "string") {
      throw new Error("La contraseña es obligatoria.");
    }

    if (!apodo || typeof apodo !== "string") {
      throw new Error("El apodo debe ser una cadena de texto.");
    }

    if (!["usuario", "admin"].includes(rol)) {
      throw new Error("El rol debe ser 'usuario' o 'admin'.");
    }

    // Asignación de valores
    this._id = new ObjectId();
    this.email = email;
    this.contraseña = this.hashPassword(contraseña);
    this.apodo = apodo;
    this.rol = rol;
  }

  hashPassword(contraseña) {
    return bcrypt.hashSync(contraseña, 10);
  }

  validarPassword(contraseña) {
    return bcrypt.compareSync(contraseña, this.contraseña);
  }

  // Conversión a objeto para MongoDB
  toDBObject() {
    return {
      _id: this._id,
      email: this.email,
      contraseña: this.contraseña,
      apodo: this.apodo,
      rol: this.rol,
    };
  }
}
