const Newsletter = require("../Model/newsletterModel");
const nodemailer = require("nodemailer");

// Verificar si las variables de entorno están definidas
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error(
    "Faltan las credenciales de correo electrónico en el archivo .env"
  );
}

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Correo de Gmail
    pass: process.env.EMAIL_PASS, // Contraseña de aplicación de Gmail
  },
});

// Controlador para suscripción a la newsletter
const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  // Validación básica del correo electrónico
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Correo electrónico inválido." });
  }

  try {
    // Verificar si el correo ya está suscrito
    const existingEmail = await Newsletter.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Este correo ya está suscrito." });
    }

    // Guardar el correo en la base de datos
    const newEmail = new Newsletter({ email });
    await newEmail.save();

    // Enviar correo de confirmación
    const mailOptions = {
      from: process.env.EMAIL_USER, // Correo desde el que se envía
      to: email, // Correo destinatario
      subject: "Confirmación de suscripción",
      text: `Gracias por suscribirte a nuestra newsletter. Hemos recibido tu correo: ${email}`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    // Responder con éxito
    res.status(200).json({
      message: "Suscripción exitosa, se ha enviado un correo de confirmación.",
    });
  } catch (error) {
    console.error("Error al suscribir:", error);
    res
      .status(500)
      .json({ error: "Hubo un problema al procesar la suscripción." });
  }
};

module.exports = {
  subscribeToNewsletter,
};
