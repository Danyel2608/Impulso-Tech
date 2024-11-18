import React, { useState } from "react";
import ReactDOM from "react-dom"; // Importar ReactDOM para usar createPortal
import "./ForgetPassword.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgLeft3 from "../../assets/Description3.jpg";
import ModalForget from "../Modal/ModalForget"; // Asegúrate de importar tu modal

function ForgetPassword() {
  // Estados para el formulario y el mensaje de respuesta
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [answerSecurity, setAnswerSecurity] = useState("");
  const [message, setMessage] = useState(""); // Para mostrar mensaje de éxito o error
  const [isSuccess, setIsSuccess] = useState(false); // Estado para saber si es un mensaje de éxito o error
  const [isLoading, setIsLoading] = useState(false); // Para manejar estado de carga
  const [modalVisible, setModalVisible] = useState(false); // Para controlar la visibilidad del modal
  const [pending, setPending] = useState(false); // Estado para mostrar el loading indicator (si es necesario)

  // Función para manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validación básica
    if (!email || !password || !answerSecurity) {
      setMessage("Por favor completa todos los campos.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    setIsLoading(true); // Activar el estado de carga
    setMessage(""); // Limpiar mensaje anterior

    try {
      setPending(true); // Para manejar el estado de carga
      // Realizar la petición PUT
      const response = await fetch("http://localhost:8001/auth/forget", {
        method: "PUT", // Cambiar de POST a PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          answerSecurity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si la respuesta es exitosa
        setMessage("Contraseña actualizada correctamente.");
        setIsSuccess(true);
      } else {
        // Si hubo un error en la respuesta
        if (data.error && data.error.includes("respuesta incorrecta")) {
          setMessage("La respuesta de seguridad es incorrecta.");
          setIsSuccess(false);
        } else {
          setMessage(
            data.error || "Hubo un problema al cambiar la contraseña."
          );
          setIsSuccess(false);
        }
      }
    } catch (error) {
      // Si ocurre un error en la solicitud fetch
      setMessage("Hubo un problema al procesar la solicitud.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false); // Desactivar estado de carga
      setPending(false); // Desactivar el loading
      setModalVisible(true); // Mostrar el modal con el mensaje
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="forget-content">
      <form onSubmit={handleSubmit}>
        <div className="forget-logo">
          <img src={LogoModaModerna} alt="logo" />
        </div>
        <h3>FORGET PASSWORD</h3>
        <div className="forget-dates">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h5>What was the name of your school?</h5>
          <input
            type="text"
            placeholder="Answer Security"
            value={answerSecurity}
            onChange={(e) => setAnswerSecurity(e.target.value)}
            required
          />
        </div>
        <div className="forget-info">
          <h5>
            Si no te acuerdas de tus credenciales contacta con nosotros <br />
            <a href="mailto:contacto@modaurbana.com">Soporte</a>
          </h5>
        </div>
        <div className="submit">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Submit"}
          </button>
        </div>
      </form>
      {/* Ventana Modal usando ReactDOM.createPortal */}
      {ReactDOM.createPortal(
        <ModalForget
          visible={modalVisible}
          header={isSuccess ? "Éxito" : "Error"}
          message={message}
          isSuccess={isSuccess}
          onClose={handleCloseModal}
        />,
        document.getElementById("modal") // El contenedor para el modal
      )}
      <div className="img-left">
        <img src={ImgLeft3} alt="img-left3" />
      </div>
    </div>
  );
}

export default ForgetPassword;
