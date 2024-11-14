// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  marca: String,
  tipo_prenda: String,
  precio: Number,
  novedad: Boolean,
  rebaja: Boolean,
  descuento: Number,
  talla: [String],
  color: [String],
  material: String,
  fecha_agregado: String,
  stock: Number,
  imagen_url: String,
});

module.exports = mongoose.model("Product", productSchema);
