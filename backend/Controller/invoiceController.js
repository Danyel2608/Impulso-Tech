const nodemailer = require("nodemailer");

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvoiceEmail = async (req, res) => {
  const { recipientEmail, itemsCart } = req.body; // Asegúrate de que 'recipientEmail' y 'itemsCart' se pasen correctamente desde el frontend

  // Crear el contenido HTML del correo
  const itemsHTML = itemsCart
    .map(
      (item) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `
    )
    .join("");

  const totalAmount = itemsCart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const emailContent = `
  <h1 style="text-align: center; color: #333;">Factura de Compra</h1>
  <p style="text-align: center; font-size: 1.2em; color: #555;">¡Gracias por tu compra! Aquí tienes el resumen de tu pedido.</p>
  
  <div style="max-width: 600px; margin: 0 auto; background-color: #f7f7f7; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; color: #333;">Resumen del Pedido</h2>
  
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead style="background-color: #f1f1f1;text-align: center;">
        <tr>
          <th style="padding: 10px; font-size: 1em; color: #333; width: 30%;">Producto</th>
          <th style="padding: 10px; font-size: 1em; color: #333; width: 20%;">Talla</th>
          <th style="padding: 10px; font-size: 1em; color: #333; width: 20%;">Cantidad</th>
          <th style="padding: 10px; font-size: 1em; color: #333; width: 15%;">Precio Unitario</th>
          <th style="padding: 10px; font-size: 1em; color: #333; width: 15%;">Total</th>
        </tr>
      </thead>
      <tbody style="text-align: center">
        ${itemsHTML}
      </tbody>
    </table>
  
    <hr style="border: 1px solid #eee; margin-top: 20px;">
  
    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
      <strong style="font-size: 1.2em; color: #333;">Total:</strong>
      <span style="font-size: 1.2em; color: #28a745;">$${totalAmount.toFixed(
        2
      )}</span>
    </div>
  
    <p style="margin-top: 20px; font-size: 1.1em; color: #555; text-align: center;">Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
  
    <div style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #888;">
      <p>Gracias por elegirnos. ¡Esperamos verte de nuevo pronto!</p>
      <p>Moda Urbana - Todos los derechos reservados</p>
    </div>
  </div>
  

  
    `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "Tu factura de compra",
    html: emailContent,
  };
  const mailOptions2 = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Factura de compra de ${recipientEmail}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptions2);
    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: "Error al enviar el correo." });
  }
};

module.exports = { sendInvoiceEmail };
