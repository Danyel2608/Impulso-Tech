import React, { useState } from "react";
import "./NewsletterPage.css";
import NewsletterVideoBackground from "../../assets/Video2.mp4";

function NewsletterPage() {
  const [email, setEmail] = useState(""); // Estado para almacenar el correo
  const [loading, setLoading] = useState(false); // Estado para mostrar cargando
  const [error, setError] = useState(null); // Estado para mostrar errores
  const [success, setSuccess] = useState(false); // Estado para mostrar éxito

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página al enviar el formulario
    setLoading(true); // Activar el estado de cargando
    setError(null); // Limpiar cualquier error previo

    try {
      // Hacer la solicitud POST usando fetch
      const response = await fetch(
        "http://localhost:8001/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Especificar que estamos enviando datos JSON
          },
          body: JSON.stringify({ email }), // Enviar el correo electrónico en formato JSON
        }
      );

      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        setSuccess(true); // Mostrar el mensaje de éxito
        setEmail(""); // Limpiar el campo de correo
        // Eliminar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        // Si la respuesta no es exitosa, manejar el error
        const data = await response.json(); // Obtener el mensaje de error
        if (data.error === "Este correo ya está suscrito.") {
          setError("El email ingresado ya está registrado.");
        } else {
          setError("Hubo un problema al registrarse.");
        }

        // Eliminar el mensaje de error después de 5 segundos
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (err) {
      setError("Hubo un problema al registrarse."); // Mostrar el mensaje de error
      // Eliminar el mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false); // Desactivar el estado de cargando
    }
  };

  return (
    <div className="newsletter-page">
      {/* Contenedor de fondo con el video */}
      <div className="newsletter-video-background">
        <video src={NewsletterVideoBackground} autoPlay loop muted />
      </div>

      {/* Contenedor del formulario */}
      <div className="newsletter-page-form">
        <h2>Suscríbete a nuestra Newsletter</h2>
        {success && <p>¡Te has suscrito correctamente!</p>}{" "}
        {/* Mensaje de éxito */}
        {error && <p className="error">{error}</p>} {/* Mensaje de error */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Suscribirse"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewsletterPage;
