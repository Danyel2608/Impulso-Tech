const nodemailer = require("nodemailer");

const enviarMail = async (user) => {
  const encodedEmail = encodeURIComponent(user.email);
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

  const mensaje = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Correo de verificacion ✔ ",
    text: `Verificación de registro en Moda Moderna. Confirma tu cuenta con el siguiente enlace: ${confirmationLink}`,
    html: `
            <h2>Verificación de registro en Moda Moderna</h2>
            <p>Gracias por registrarte, ${user.name}.</p>
            <p>Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
            <a href="${confirmationLink}">Confirmar cuenta</a>
            <br>
            <p>Si no te registraste en nuestra página, ignora este correo.</p>`,
  };
  try {
    const transporter = nodemailer.createTransport(config);
    const info = await transporter.sendMail(mensaje);
    console.log("Correo enviado: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo: ", error);
    throw new Error("No se pudo enviar el correo de verificación");
  }
};

module.exports = { enviarMail };
