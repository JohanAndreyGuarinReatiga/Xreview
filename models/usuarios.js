import { ObjectId } from "mongodb";
import  bcrypt  from "bcrypt";

export class Usuario {
  constructor({ email, password, apodo, rol }) {
    // Validaciones

    if (!email || !/^.+@.+\..+$/.test(email)) {
      throw new Error("El email es obligatorio y debe tener un formato valido.");
    }

    if (!password || typeof password !== "string") {
      throw new Error("La password es obligatoria.");
    }

    if (!apodo || typeof apodo !== "string") {
      throw new Error("El apodo debe ser una cadena de texto.");
    }

    if (!["usuario", "administrador"].includes(rol)) {
      throw new Error("El rol debe ser 'usuario' o 'administrador'.");
    }

    // Asignación de valores
    this._id = new ObjectId();
    this.email = email;
    this.password = this.hashPassword(password);
    this.apodo = apodo;
    this.rol = rol;
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  validarPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  // Conversión a objeto para MongoDB
  toDBObject() {
    return {
      _id: this._id,
      email: this.email,
      password: this.password,
      apodo: this.apodo,
      rol: this.rol,
    };
  }
}
