//importar loginController y generar las rutas para el registro y el login
const loginController = require("../Controller/loginController");
const verifyToken = require("../middlewares/auth");
const router = require("express").Router();

//endpoint registro
router.post("/signup", loginController.signup);
//endpoint login
router.post("/login", loginController.login);
router.get("/allLogins", verifyToken, loginController.getAllLogins);
router.get("/loginId", verifyToken, loginController.getLoginId);
//endpoint para refrescar token
router.get("/refresh", verifyToken, loginController.refreshToken);
//Endpoint para restablecer contraseña
router.put("/forget", loginController.forgetPassword)
//Endpoint para eliminar un usuario
router.delete("/deleteUser", verifyToken, loginController.deleteUser);

module.exports = router;
