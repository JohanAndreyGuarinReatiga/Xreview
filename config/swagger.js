import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Xreview API",
    description: "Documentación de la API de Xreview",
  },
  host: "localhost:5500", // cámbialo si usas otro puerto
  schemes: ["http"],
};

const outputFile = "swagger-output.json"; 
const endpointsFiles = ["./routers/authRoutes.js", "./routers/usuarioRoutes.js", "./routers/tituloRoutes.js", "./routers/reseniaRouter.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
