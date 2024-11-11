const router = require("express").Router();
const emailController = require("../Controller/mailcontroller");

//Confirmar email
router.put("/confirmar/:email", emailController.confirmarEmail);

module.exports = router;
