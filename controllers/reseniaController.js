import { ServicioResenias } from "../services/reseniaServ.js";
import { exitosoResponse, errorResponse } from "../utils/responses.js";
import { ObjectId } from "mongodb";

export const crearReseniaCtrl = async (req, res) => {
  try {
    const data = {
      ...req.body,
      usuarioId: new ObjectId(req.user._id), // ingreso del id limpio
    };
    const result = await ServicioResenias.crearResenia(data);
    return exitosoResponse(res, result, "Reseña creada exitosamente");
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const editarReseniaCtrl = async (req, res) => {
  try {
    const reseña = await ServicioResenias.editarResenia(req.params.id, new ObjectId(req.user._id), req.body);
    return exitosoResponse(res, reseña, "Reseña actualizada");
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const eliminarReseniaCtrl = async (req, res) => {
  try {
    const resultado = await ServicioResenias.eliminarResenia(
      req.params.id,
      req.user.rol,
      new ObjectId(req.user._id)
    );   

    return exitosoResponse(res, resultado, "Reseña eliminada");
  } catch (error) {
    // console.error("Error al eliminar reseña:", error); //  ver error exacto
    return errorResponse(res, "Error interno del servidor", 500);
  }
};

export const likeReseniaCtrl = async (req, res) => {
  try {
    const resultado = await ServicioResenias.likeResenia(
      req.params.id,
      new ObjectId(req.user._id)
    );
    return exitosoResponse(res, resultado, "Like registrado");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const dislikeReseniaCtrl = async (req, res) => {
  try {
    const resultado = await ServicioResenias.dislikeResenia(
      req.params.id,
      new ObjectId(req.user._id)
    );
    return exitosoResponse(res, resultado, "Dislike registrado");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};