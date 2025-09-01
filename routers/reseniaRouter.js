import { Router } from "express";
import passport from "passport";
import {
  crearReseniaCtrl,
  editarReseniaCtrl,
  eliminarReseniaCtrl,
  likeReseniaCtrl,
  dislikeReseniaCtrl,
  listarReseniasCtrl,
} from "../controllers/reseniaController.js";

const router = Router();

router.post(
  "/post",
  /*  
    #swagger.tags = ["Reseñas"]
    #swagger.summary = "Crear reseña"
    #swagger.description = "Crea una nueva reseña asociada a un título."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ReseniaCrear" }
        }
      }
    }
    #swagger.responses[201] = { description: "Reseña creada exitosamente" }
  */
  passport.authenticate("jwt", { session: false }),
  crearReseniaCtrl
);

// Editar reseña solo el que la hizo`
router.put(
  "/editar/:id",
  /*  
    #swagger.tags = ["Reseñas"]
    #swagger.summary = "Editar reseña"
    #swagger.description = "Permite editar una reseña propia."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID de la reseña a editar" }
    #swagger.responses[200] = { description: "Reseña actualizada" }
  */
  passport.authenticate("jwt", { session: false }),
  editarReseniaCtrl
);

router.delete(
  "/eliminar/:id",
  /*  
    #swagger.tags = ["Reseñas"]
    #swagger.summary = "Eliminar reseña"
    #swagger.description = "Elimina una reseña (solo el autor o admin)."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID de la reseña a eliminar" }
    #swagger.responses[200] = { description: "Reseña eliminada" }
  */
  passport.authenticate("jwt", { session: false }),
  eliminarReseniaCtrl
);

router.post(
  "/like/:id",
  /*  
    #swagger.tags = ["Reseñas"]
    #swagger.summary = "Dar like a reseña"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID de la reseña" }
  */
  passport.authenticate("jwt", { session: false }),
  likeReseniaCtrl
);

router.post(
  "/dislike/:id",
  /*  
    #swagger.tags = ["Reseñas"]
    #swagger.summary = "Dar dislike a reseña"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID de la reseña" }
  */
  passport.authenticate("jwt", { session: false }),
  dislikeReseniaCtrl
);

router.get(
  "/",
  /*  
    #swagger.tags = ["Reseñas"]
    #swagger.summary = "Listar reseñas"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: "Listado de reseñas" }
  */
  passport.authenticate("jwt", { session: false }),
  listarReseniasCtrl
);

export default router;
