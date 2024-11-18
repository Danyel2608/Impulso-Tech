const bcrypt = require("bcrypt");
const Login = require("../Model/loginModel");
const { generateToken } = require("../lib/util");
const { enviarMail } = require("./src/mailConfig");

//Get all Logins
const getAllLogins = async (req, res) => {
  try {
    const logins = await Login.find();
    res.json(logins);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los logins" });
  }
};
//Get Login by id
const getLoginId = async (req, res) => {
  try {
    const userId = req.body._id;
    const login = await Login.findOne(userId);
    res.json(login);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener login by id" });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, lastName, role, answerPrivate } = req.body;

    // Verificar si el correo electrónico ya está registrado en la base de datos
    const existingUserWithEmail = await Login.findOne({ email });

    if (existingUserWithEmail) {
      return res.status(409).json({
        status: "failed",
        data: null,
        error: "Email already exists. Please choose a different email address.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new Login({
      name,
      lastName,
      email,
      role,
      password: passwordHash,
      answerPrivate,
      confirmEmail: false, // El correo electrónico no está confirmado inicialmente
    });

    // Guardar el usuario en la base de datos
    await user.save();

    // Enviar correo electrónico de confirmación
    enviarMail(user);

    // Enviar respuesta con mensaje de éxito
    res.status(201).json({
      status: "Succeeded",
      data: {
        message:
          "Please verify your email address. A confirmation email has been sent to your email.",
        user: {
          // No incluyas el token y refreshToken aquí
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      error: null,
    });
  } catch (error) {
    // Manejar errores
    res
      .status(400)
      .json({ status: "failed", data: null, error: error.message });
  }
};

//POST login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Login.findOne({ email });

    // Verificar si se encontró un usuario con el correo electrónico proporcionado
    if (!user) {
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "This email not exist.",
      });
    }

    // Verificar la contraseña del usuario
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "Wrong email or password. Please try again.",
      });
    }

    if (user.confirmEmail != true) {
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "The email has not been verified yet",
      });
    }

    // Si la contraseña es válida, generar tokens
    const payload = { id: user._id, email: user.email };
    const token = generateToken(payload, false);
    const refreshToken = generateToken(payload, true);

    // Enviar tokens junto con los datos del usuario
    res.status(201).json({
      status: "Succeeded",
      data: {
        user,
        token,
        refreshToken,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      data: null,
      error: error.message,
    });
  }
};

//GET /auth/refresh-token
const refreshToken = async (req, res) => {
  try {
    //si no hay payload desde token de refresco,enviar error
    if (!req.user) {
      res.status(403).json({
        status: "failed",
        data: null,
        error: "Unauthorized",
      });
    }
    //si hay token de refresco y ha expirado,obtener el payload y enviar 2 nuevos token
    const payload = {
      id: req.user.id,
      email: req.user.email,
    };
    res.status(201).json({
      status: "Succeeded",
      data: {
        user: payload,
        token: generateToken(payload, false),
        refreshToken: generateToken(payload, true),
      },
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Succeeded",
      data: null,
      error: err.message,
    });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email, password, answerSecurity } = req.body;

    // Buscar al usuario por correo electrónico
    const user = await Login.findOne({ email });

    if (!user) {
      // Si el usuario no existe
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "Este correo no está registrado. Por favor, verifica el correo.",
      });
    }

    // Obtener la respuesta a la pregunta de seguridad del usuario
    const answer = user.answerPrivate;

    if (answerSecurity !== answer) {
      // Si la respuesta a la pregunta de seguridad no es correcta
      return res.status(400).json({
        status: "failed",
        data: null,
        error: "La respuesta de seguridad es incorrecta.",
      });
    }

    // Si la respuesta es correcta, procedemos a actualizar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizamos la contraseña del usuario
    user.password = hashedPassword;

    // Guardamos los cambios en la base de datos
    await user.save();

    // Respuesta exitosa
    res.status(200).json({
      status: "Succeeded",
      data: null,
      error: null,
    });
  } catch (error) {
    // En caso de error en la solicitud
    console.error(error);
    res.status(500).json({
      status: "Failed",
      data: null,
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el correo está presente en la solicitud
    if (!email) {
      return res.status(400).json({
        status: "failed",
        data: null,
        error: "Correo electrónico no proporcionado en la solicitud.",
      });
    }

    // Buscar al usuario por su correo electrónico
    const user = await Login.findOne({ email });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({
        status: "failed",
        data: null,
        error: "Usuario no encontrado.",
      });
    }

    // Eliminar el usuario de la base de datos
    await user.deleteOne();

    // Respuesta exitosa
    res.status(200).json({
      status: "succeeded",
      data: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      data: null,
      error: "Error al intentar eliminar el usuario.",
    });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  forgetPassword,
  deleteUser,
  getAllLogins,
  getLoginId,
};
