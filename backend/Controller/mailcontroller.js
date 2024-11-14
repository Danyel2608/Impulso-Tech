const Login = require("../Model/loginModel");

const confirmarEmail = async (req, res) => {
  const emailUser = decodeURIComponent(req.params.email); // Obtener el email desde params y decodificarlo

  try {
    // Encuentra y actualiza el usuario en una sola operación
    const user = await Login.findOneAndUpdate(
      { email: emailUser },
      { confirmEmail: true },
      { new: true } // Devuelve el documento actualizado
    );

    if (user) {
      res.json({
        data: {
          confirmado: true,
          email: emailUser,
          message: "Correo electrónico confirmado correctamente.",
        },
      });
    } else {
      console.log("No se encuentra al usuario");
      res.json({
        data: {
          confirmado: false,
          message: "Correo electrónico no encontrado.",
        },
      });
    }
  } catch (error) {
    console.log("Error al confirmar correo electrónico:", error);
    res.json({
      confirmado: false,
      message: "Error al confirmar correo electrónico.",
    });
  }
};

module.exports = { confirmarEmail };
