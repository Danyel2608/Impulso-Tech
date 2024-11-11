const nodemailer = require('nodemailer');

const enviarMail = async (user) => {
    const encodedEmail = encodeURIComponent(user.email);
    const confirmationLink = `http://localhost:3000/confirmar?email=${encodedEmail}`;


    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "consultaskoke@gmail.com",
            pass: "dlit kryb yzju ohdv"
        },

    }

    const mensaje = {
        from: "consultaskoke@gmail.com",
        to: user.email,
        subject: "Correo de verificacion ✔ ",
        text: `Verificacion de registro en Perpetual Tattoo
        ${confirmationLink}`

    }

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail(mensaje)

    console.log(info);
}

module.exports = { enviarMail };