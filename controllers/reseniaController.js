import { ServicioResenias } from "../services/reseniaServ.js";
import { exitosoResponse, errorResponse } from "../utils/responses.js";
import { ObjectId } from "mongodb";

export const crearReseniaCtrl = async (req, res) => {
  try {
    const data = req.body;
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
