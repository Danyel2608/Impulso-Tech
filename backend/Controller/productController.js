const Product = require("../Model/productModel");

// Función para guardar un solo producto
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Producto creado exitosamente", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Función para guardar varios productos a la vez
exports.createMultipleProducts = async (req, res) => {
  try {
    const products = req.body; // Asumimos que es un array de productos
    await Product.insertMany(products);
    res
      .status(201)
      .json({ message: "Productos creados exitosamente", products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMultipleProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: "Productos obtenidos correctamente", products });
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};
