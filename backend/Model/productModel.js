const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: {
    es: { type: String, required: true }, // Nombre en español
    en: { type: String, required: true }, // Nombre en inglés
  },
  descripcion: {
    es: { type: String }, // Descripción en español
    en: { type: String }, // Descripción en inglés
  },
  categoria: {
    es: { type: String, required: true }, // Categoría en español
    en: { type: String, required: true }, // Categoría en inglés
  },
  marca: { type: String, required: true },
  tipo_prenda: {
    es: { type: String, required: true }, // Tipo de prenda en español
    en: { type: String, required: true }, // Tipo de prenda en inglés
  },
  precio: { type: Number, required: true },
  novedad: { type: Boolean, default: false },
  rebaja: { type: Boolean, default: false },
  descuento: { type: Number, default: 0 },
  talla: [String],
  color: {
    es: { type: String, required: true }, // Color en español
    en: { type: String, required: true }, // Color en inglés
  },
  material: {
    es: { type: String, required: true }, // Material en español
    en: { type: String, required: true }, // Material en inglés
  },
  fecha_agregado: { type: String, required: true },
  stock: { type: Number, required: true },
  imagen_url: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
