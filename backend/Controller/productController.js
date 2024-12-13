const Product = require("../Model/productModel");
const mongoose = require("mongoose");

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

exports.deleteProductId = async (req, res) => {
  try {
    const productId = req.body._id;

    // Verificar si el ID del producto está presente en la solicitud
    if (!productId) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error: "Id del producto no proporcionado en la solicitud.",
      });
    }

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error: "Id del producto no es válido.",
      });
    }

    // Buscar el producto en la base de datos
    const producto = await Product.findOne({ _id: productId });

    // Verificar si el producto existe
    if (!producto) {
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "Producto no encontrado.",
      });
    }

    // Eliminar el producto
    await producto.deleteOne();

    // Respuesta exitosa
    return res.status(200).json({
      status: "succeeded",
      data: { message: "Producto eliminado exitosamente." },
      error: null,
    });
  } catch (error) {
    console.error("Error al intentar eliminar el producto:", error.message);
    return res.status(500).json({
      status: "failed",
      data: null,
      error: "Error al intentar eliminar el producto.",
    });
  }
};
// Función para actualizar el producto
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.body._id; // ID del producto a actualizar
    const updates = req.body.updates; // Propiedades a actualizar
    const lang = req.body.lang; // Idioma de la actualización

    if (!productId) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error: "Id del producto no proporcionado en la solicitud.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error: "Id del producto no es válido.",
      });
    }

    if (
      !updates ||
      typeof updates !== "object" ||
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error:
          "Debe proporcionar al menos una propiedad para actualizar en 'updates'.",
      });
    }

    // Validar que al menos uno de los campos requeridos esté presente en `updates`
    const allowedUpdates = [
      "precio",
      "talla",
      "color",
      "stock",
      "descuento",
      "novedad",
      "nombre", // Aseguramos que "nombre" esté en la lista de campos permitidos
    ];
    const hasValidUpdates = Object.keys(updates).some((key) =>
      allowedUpdates.includes(key)
    );

    if (!hasValidUpdates) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error:
          "Debe proporcionar al menos una propiedad válida para actualizar: precio, talla, color, stock, descuento, novedad o nombre.",
      });
    }

    // Si el nombre o el color tienen que actualizarse según el idioma
    if (updates.nombre) {
      updates[`nombre.${lang}`] = updates.nombre;
      delete updates.nombre;
    }

    if (updates.color) {
      // Si el color es un objeto, asignamos el valor para el idioma correspondiente
      if (typeof updates.color === "object") {
        updates[`color.${lang}`] = updates.color[lang]; // Guardamos el valor para el idioma específico
        delete updates.color; // Eliminamos la clave 'color' original
      }
    }

    // Buscar y actualizar el producto
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updates },
      { new: true, runValidators: true } // Retornar el documento actualizado y validar
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "Producto no encontrado.",
      });
    }

    return res.status(200).json({
      status: "succeeded",
      data: updatedProduct,
      error: null,
    });
  } catch (error) {
    console.error("Error al intentar actualizar el producto:", error.message);
    return res.status(500).json({
      status: "failed",
      data: null,
      error: "Error al intentar actualizar el producto.",
    });
  }
};
