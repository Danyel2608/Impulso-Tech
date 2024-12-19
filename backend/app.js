const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

// Importar las rutas
const logins = require("./Routes/loginRoutes");
const emailsConfirm = require("./Routes/emailRoutes");
const newsletterRoutes = require("./Routes/newsletterRoutes");
const productRoutes = require("./Routes/productRoutes");
const invoiceRoutes = require("./Routes/invoiceRoutes");

mongoose.set("strictQuery", true);

// Crear la aplicación express
const app = express();

// Configurar body-parser con un límite mayor
app.use(bodyParser.json({ limit: "10mb" })); // Aumenta el límite según sea necesario
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Middleware
app.use(express.json()); // Analizar los datos JSON
app.use(
  cors({
    origin: "http://localhost:3000", // Permitir solicitudes del frontend
    optionsSuccessStatus: 200,
  })
);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => console.log("Successfully connected to the database"))
  .catch((err) => console.error("Error al conectar con MongoDB", err));

// Configurar las rutas
app.use("/auth", logins);
app.use("/emails", emailsConfirm);
app.use("/newsletter", newsletterRoutes);
app.use("/api", productRoutes);
app.use("/invoice", invoiceRoutes);

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
