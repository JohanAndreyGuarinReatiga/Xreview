import { Router } from "express";
import passport from "passport";
import {
  crearTitulo,
  listarTitulos,
  editarTitulo,
  eliminarTitulo,
  obtenerTitulo,
  aprobarTitulo,
  listarConFiltros,
  listarTituloPaginado,
  estadisticasActualizadas,
  busquedaTexto,
  topRanking,
  masMeGustas,
  listaDeUsuario,
} from "../controllers/tituloController.js";
import { esAdmin } from "../middlewares/roles.js";

const router = Router();

// rutas publicas
router.get("/listar", listarTitulos); // listar títulos (solo aprobados si es usuario normal)
router.get("/buscar/:titulo", obtenerTitulo); // buscar por nombre exacto

//rutas privadas(protegidas)
router.get("/filtros",passport.authenticate("jwt", { session: false }),listarConFiltros);
router.get("/paginado",passport.authenticate("jwt", { session: false }),listarTituloPaginado );
router.get("/buscarTexto",passport.authenticate("jwt", { session: false }), busquedaTexto);
router.get("/top",passport.authenticate("jwt", { session: false }),topRanking);
router.get("/masGustados",passport.authenticate("jwt", { session: false }),masMeGustas);
router.get("/personalList/:usuarioId",passport.authenticate("jwt", { session: false }),listaDeUsuario)
router.post("/crear",passport.authenticate("jwt", { session: false }),crearTitulo);

//Rutas de solo admin
router.put("/editar/:id",passport.authenticate("jwt", { session: false }),esAdmin,editarTitulo);
router.delete("/delete/:id",passport.authenticate("jwt", { session: false }),esAdmin,eliminarTitulo);
router.patch("/aprobar/:id",passport.authenticate("jwt", { session: false }),esAdmin,aprobarTitulo);


export default router;
