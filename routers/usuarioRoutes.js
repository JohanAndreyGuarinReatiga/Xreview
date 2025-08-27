import { Router } from "express";
import passport from "passport";
import { listarUsuario, eliminarUsuario } from "../controllers/usuarioController.js";
import { esAdmin } from "../middlewares/roles.js";

const router = Router();

// Ruta protegida con Passport-JWT
// Sirve para devolver los datos del usuario que está logueado actualmente, usando el token como prueba de identidad
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      mensaje: "Perfil del usuario",
      user: {
        id: req.user._id,
        email: req.user.email,
        apodo: req.user.apodo,
        rol: req.user.rol,
      },
    });
  }
);

// Listar usuarios
router.get(
  "/listar",
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  listarUsuario
);

// Eliminar usuario
router.delete(
  "/eliminar/:id",
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  eliminarUsuario
);

export default router;
