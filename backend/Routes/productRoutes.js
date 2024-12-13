// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../Controller/productController");

// Ruta para crear un solo producto
router.post("/producto", productController.createProduct);

// Ruta para crear múltiples productos
router.post("/productos", productController.createMultipleProducts);

//Ruta para obtener todos los productos
router.get("/all-products", productController.getMultipleProducts);

//Ruta para borrar producto por ID
router.delete("/deleteId", productController.deleteProductId);

//Modificar producto
router.put("/updateProduct", productController.updateProduct),
  (module.exports = router);
