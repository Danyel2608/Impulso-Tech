const express = require("express");
const router = express.Router();
const { sendInvoiceEmail } = require("../Controller/invoiceController"); // Asegúrate de que esta línea sea correcta

// Ruta POST para enviar la factura
router.post("/send-invoice", sendInvoiceEmail); // Asegúrate de que 'sendInvoiceEmail' esté correctamente importado

module.exports = router;
