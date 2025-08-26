// dataset.js
import { ObjectId, Int32, Double } from "mongodb";
import { connect, getDB } from "./configdb.js";

async function seed() {
  await connect();

  // Usuarios
  const usuarios = [
    {
      _id: new ObjectId("66d07a1f4b2f4d3f9f1a1111"),
      email: "juan@example.com",
      contraseña: "1234",
      apodo: "Juanito",
      rol: "usuario",
    },
    {
      _id: new ObjectId("66d07a1f4b2f4d3f9f1a2222"),
      email: "admin@example.com",
      contraseña: "1234",
      apodo: "AdminMaster",
      rol: "administrador", // ✅ corregido (antes "admin")
    },
  ];

  // Títulos
  const titulos = [
    {
      _id: new ObjectId("66d07a1f4b2f4d3f9f1b3333"),
      titulo: "Inception",
      tipo: "pelicula",
      descripcion:
        "Un ladrón que roba secretos corporativos a través de los sueños debe implantar una idea en la mente de un CEO.",
      categoria: "Ficción", // ✅ corregido (antes "Ciencia")
      anio: new Int32(2010),
      imagenUrl:
        "https://res.cloudinary.com/demo/image/upload/v1692999999/inception.jpg",
      aprobado: true,
      creadoPor: new ObjectId("66d07a1f4b2f4d3f9f1a2222"),
      estadisticas: {
        promedioCalificacion: new Double(9.0),
        meGusta: new Int32(12),
        noMeGusta: new Int32(1),
        totalResenas: new Int32(3),
        ranking: new Double(1.0),
      },
    },
    {
      _id: new ObjectId("66d07a1f4b2f4d3f9f1b4444"),
      titulo: "Attack on Titan",
      tipo: "anime",
      descripcion:
        "La humanidad lucha por sobrevivir contra gigantes que devoran personas.",
      categoria: "Acción",
      anio: new Int32(2013),
      imagenUrl:
        "https://res.cloudinary.com/demo/image/upload/v1692999999/aot.jpg",
      aprobado: true,
      creadoPor: new ObjectId("66d07a1f4b2f4d3f9f1a2222"),
      estadisticas: {
        promedioCalificacion: new Double(8.8),
        meGusta: new Int32(20),
        noMeGusta: new Int32(2),
        totalResenas: new Int32(5),
        ranking: new Double(2.0),
      },
    },
  ];

  // Reseñas
  const resenia = [
    {
      _id: new ObjectId("66d07a1f4b2f4d3f9f1c5555"),
      tituloId: new ObjectId("66d07a1f4b2f4d3f9f1b3333"),
      usuarioId: new ObjectId("66d07a1f4b2f4d3f9f1a1111"),
      encabezado: "Una obra maestra",
      comentario:
        "La mejor película de ciencia ficción que he visto, increíble dirección y guion.",
      calificacion: new Int32(10),
      meGusta: [new ObjectId("66d07a1f4b2f4d3f9f1a2222")],
      noMeGusta: [],
    },
    {
      _id: new ObjectId("66d07a1f4b2f4d3f9f1c6666"),
      tituloId: new ObjectId("66d07a1f4b2f4d3f9f1b4444"),
      usuarioId: new ObjectId("66d07a1f4b2f4d3f9f1a1111"),
      encabezado: "Acción brutal",
      comentario: "La historia engancha y la animación es espectacular.",
      calificacion: new Int32(9),
      meGusta: [],
      noMeGusta: [],
    },
  ];

  // Limpiar colecciones previas
  await getDB().collection("usuarios").deleteMany({});
  await getDB().collection("titulos").deleteMany({});
  await getDB().collection("resenia").deleteMany({});

  // Insertar dataset
  await getDB().collection("usuarios").insertMany(usuarios);
  await getDB().collection("titulos").insertMany(titulos);
  await getDB().collection("resenia").insertMany(resenia);

  console.log("✅ Datos insertados correctamente");
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
