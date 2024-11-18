const Newsletter = require("../Model/newsletterModel");
const nodemailer = require("nodemailer");
const path = require("path");

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

    // Ruta de la imagen local (ajústala según tu estructura de carpetas)
    const logoPath = path.join(__dirname, "..", "assets", "ModaUrbanaLogo.png");

    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER, // Correo desde el que se envía
      to: email, // Correo destinatario
      subject: "Confirmación de suscripción",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .header img {
                width: 150px; /* Ajusta el tamaño del logo */
                height: auto;
              }
              .content {
                text-align: center;
                font-size: 16px;
                line-height: 1.6;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 14px;
                color: #888;
              }
              a.button {
                background-color: #007bff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                margin-top: 20px;
                display: inline-block;
                color: #fff; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="cid:logo" alt="Logo de Moda Urbana" />
              </div>
              <div class="content">
                <h1>¡Gracias por suscribirte!</h1>
                <p>Hemos recibido tu correo <strong>${email}</strong> con éxito. Ahora estarás al tanto de todas nuestras novedades, promociones y noticias.</p>
                <p>¡Bienvenido a nuestra comunidad!</p>
                <a href="http://localhost:3000/" class="button">Visita nuestro sitio</a>
              </div>
              <div class="footer">
                <p>Si tienes alguna pregunta, no dudes en <a href="mailto:contacto@modaurbana.com">Contáctanos</a>.</p>
                <p>&copy; ${new Date().getFullYear()} Moda Urbana. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: "ModaUrbanaLogo.png",
          path: logoPath,
          cid: "logo", // Referencia el CID aquí
        },
      ],
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
