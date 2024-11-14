const mongoose = require("mongoose");

// Define el esquema para la newsletter (correo electrónico)
const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Convertir a minúsculas automáticamente
    },
  },
  { timestamps: true } // Para registrar las fechas de creación y actualización
);

// Crea el modelo a partir del esquema y lo asocia con la colección 'newsletter'
const Newsletter = mongoose.model("Newsletter", newsletterSchema, "newsletter");

module.exports = Newsletter;
