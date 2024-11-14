const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

// Importar las rutas
const logins = require("./Routes/loginRoutes");
const emailsConfirm = require("./Routes/emailRoutes");
const newsletterRoutes = require("./Routes/newsletterRoutes");

mongoose.set("strictQuery", true);

// Crear la aplicación express
const app = express();

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
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to the database"))
  .catch((err) => console.error("Error al conectar con MongoDB", err));

// Configurar las rutas
app.use("/auth", logins);
app.use("/emails", emailsConfirm);
app.use("/newsletter", newsletterRoutes);

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
