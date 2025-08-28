import { Router } from "express";
import passport from "passport";
import {
  crearTitulo,
  listarTitulos,
  editarTitulo,
  eliminarTitulo,
  obtenerTitulo,
  aprobarTitulo,
} from "../controllers/tituloController.js";
import { esAdmin } from "../middlewares/roles.js";

const router = Router();

// rutas publicas
router.get("/listar", listarTitulos);
router.get("/buscar/:titulo", obtenerTitulo);

//rutas privadas(protegidas)

router.post(
  "/crear",
  passport.authenticate("jwt", { session: false }),
  crearTitulo
);

router.put(
  "/editar/:id",
  passport.authenticate("jwt", { session: false }),
  editarTitulo
);

//Rutas de solo admin
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  eliminarTitulo
);

router.patch(
  "/aprobar/:id",
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  aprobarTitulo
);

export default router;
