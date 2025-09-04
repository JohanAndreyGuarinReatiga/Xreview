import { Exportacion } from "../services/exportacion";

export const exportarResenasCtrl = async (req, res) => {
    try {
      const { tid } = req.body; 
      if (!tid) {
        return res.status(400).send({ error: "hay que poner un id" });
      }
  
      const exportacion = new Exportacion();
      const archivoGenerado = await exportacion.exportarResenas(tid);
      res.status(200).send({ mensaje: "arhicvo hecho", archivo: archivoGenerado });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }