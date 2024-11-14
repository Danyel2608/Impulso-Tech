const express = require("express");
const router = express.Router();
const { subscribeToNewsletter } = require("../Controller/newsletterController");

// Definir la ruta para suscribir al newsletter
router.post("/subscribe", subscribeToNewsletter);

module.exports = router;
