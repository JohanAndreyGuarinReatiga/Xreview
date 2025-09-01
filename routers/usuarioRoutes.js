import { Router } from "express";
import passport from "passport";
import {
  listarUsuario,
  eliminarUsuario,
  editarUsuario,
} from "../controllers/usuarioController.js";
import { esAdmin } from "../middlewares/roles.js";

const router = Router();

// Ruta protegida con Passport-JWT
// Sirve para devolver los datos del usuario que está logueado actualmente, usando el token como prueba de identidad
router.get(
  "/profile",
  /*  
    #swagger.tags = ["Usuarios"]
    #swagger.summary = "Obtener perfil del usuario"
    #swagger.description = "Devuelve la información del usuario autenticado."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: "Perfil de usuario obtenido" }
  */
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
  /*  
    #swagger.tags = ["Usuarios"]
    #swagger.summary = "Listar usuarios"
    #swagger.description = "Devuelve un listado de todos los usuarios (solo admin)."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: "Listado de usuarios" }
  */
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  listarUsuario
);

// Eliminar usuario
router.delete(
  "/eliminar/:id",
  /*  
    #swagger.tags = ["Usuarios"]
    #swagger.summary = "Eliminar usuario"
    #swagger.description = "Elimina un usuario por su ID (solo admin)."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID del usuario a eliminar" }
    #swagger.responses[200] = { description: "Usuario eliminado correctamente" }
  */
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  eliminarUsuario
);

// Editar usuario (admin)
router.put(
  "/editar/:id",
   /*  
    #swagger.tags = ["Usuarios"]
    #swagger.summary = "Editar usuario"
    #swagger.description = "Permite modificar los datos de un usuario."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID del usuario a editar" }
    #swagger.requestBody = {
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UsuarioEditar" }
        }
      }
    }
    #swagger.responses[200] = { description: "Usuario actualizado" }
  */
  passport.authenticate("jwt", { session: false }),
  editarUsuario
);

export default router;
