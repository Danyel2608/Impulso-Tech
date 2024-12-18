const nodemailer = require("nodemailer");
const path = require("path");

const enviarMail = async (user) => {
  const encodedEmail = encodeURIComponent(user.email);
  // const confirmationLink = `http://192.168.1.132:8001/confirmar?email=${encodedEmail}`;
  const confirmationLink = `http://localhost:3000/confirmar?email=${encodedEmail}`;

  const config = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
  // Ruta de la imagen local (ajústala según tu estructura de carpetas)
  const logoPath = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "ModaUrbanaLogo.png"
  );

  const mensaje = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Correo de verificación ✔ ",
    text: `Verificación de registro en Moda Moderna. Confirma tu cuenta con el siguiente enlace: ${confirmationLink}`,
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
            .button:hover {
              background-color: #0056b3;
            }
            .small-text {
              font-size: 12px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logo" alt="Moda Moderna Logo" />
            </div>
            <div class="content">
              <h2>Verificación de registro en Moda Moderna</h2>
              <p>Gracias por registrarte, <strong>${user.name}</strong>.</p>
              <p>Para completar tu registro y activar tu cuenta, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
              <a href="${confirmationLink}" class="button">Confirmar cuenta</a>
              <br>
              <p class="small-text">Si no te registraste en nuestra página, por favor ignora este correo.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Moda Moderna. Todos los derechos reservados.</p>
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

  try {
    const transporter = nodemailer.createTransport(config);
    const info = await transporter.sendMail(mensaje);
    console.log("Correo enviado: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo: ", error); // Imprime el error completo
    throw new Error(
      `No se pudo enviar el correo de verificación: ${error.message}`
    ); // Incluye el mensaje de error específico
  }
};

module.exports = { enviarMail };
