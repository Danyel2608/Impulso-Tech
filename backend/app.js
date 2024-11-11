// importar los módulo express y mongoose
const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const cors = require("cors");
//obtener la informacion del archivo .env
const logins = require("./Routes/loginRoutes");
const emailsConfirm = require("./Routes/emailRoutes");

dotenv.config();
// La función express() exportada por el módulo express crea una aplicación Express.
const app = express();
// Analiza las solicitudes que contienen archivos json
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // Algunos navegadores pueden requerir un código de estado 200 para aceptar la respuesta CORS
}));

//conectar con la base de datos
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("Succesfully connected to the database")).catch((err) => console.log(err))
//guardar conexion en una constante
const db = mongoose.connection;

//verificar si la conexion ha sido exitosa
mongoose.connection.on("error", (err) => {
  console.log(err);
});

app.use("/auth", logins);
app.use("/emails", emailsConfirm);

app.listen(process.env.PORT, () => {
  // función callback que se ejecutará cuando el servidor esté listo
  console.log(`Server running on port ${process.env.PORT}`);
});


