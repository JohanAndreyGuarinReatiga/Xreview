import { validationResult, body } from "express-validator";

export const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      message: "Errores de validación",
      errors: errores.array(),
    });
  }
  next();
};

export const validarRegistro = [
  body("email").isEmail().withMessage("El email no es valido."),
  body("contraseña").isLength({min:4}).withMessage("La contraseña debe tener al menos 4 caracteres."),
  body("apodo").notEmpty().withMessage("El apodo es obligatorio")
]

export const validarLogin = [
  body("email").isEmail().withMessage("El email no es valido"),
  body("contraseña").notEmpty().withMessage("La contraseña es obligatoria")
]