// routes/usuarioRoutes.js
import { Router } from "express";
import passport from "passport";
import { listar, eliminar } from "../controllers/usuarioController.js";

const router = Router();

// Ruta protegida con Passport-JWT
// Sirve para devolver los datos del usuario que está logueado actualmente, usando el token como prueba de identidad
router.get("/profile",passport.authenticate("jwt", { session: false }),(req, res) => {
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
router.get("/listar", listar);
// Eliminar usuario
router.delete("/eliminar/:id", eliminar);

export default router;
