const express = require("express");
const router = express.Router();
const {
  subscribeToNewsletter,
  getAllNewsletterUsers,
  deleteNewsletterUser,
} = require("../Controller/newsletterController");

// Definir la ruta para suscribir al newsletter
router.post("/subscribe", subscribeToNewsletter);

//Obtener usuarios registrados en newsletter
router.get("/allNewsletterUsers", getAllNewsletterUsers);

//Borrar usuario de newsletter
router.delete("/deleteNewsletterUser", deleteNewsletterUser);

module.exports = router;
