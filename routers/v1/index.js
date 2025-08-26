import { Router } from "express";
import reseniaRouter from "./reseniaRouter.js";

const router = Router();

router.use("/resenias", reseniaRouter);

export default router;