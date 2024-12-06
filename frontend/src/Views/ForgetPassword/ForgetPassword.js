import React, { useState } from "react";
import ReactDOM from "react-dom"; // Importar ReactDOM para usar createPortal
import "./ForgetPassword.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgLeft3 from "../../assets/Description3.jpg";
import ModalForget from "../Modal/ModalForget"; // Asegúrate de importar tu modal
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción
import HeaderLanguages from "../Header/HeaderLanguages";

function ForgetPassword() {
  // Accedemos a la función de traducción
  const { translate } = useTranslation();

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
      setMessage(translate("complete_all_fields"));
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
        setMessage(translate("password_updated_successfully"));
        setIsSuccess(true);
      } else {
        // Si hubo un error en la respuesta
        if (data.error && data.error.includes("respuesta incorrecta")) {
          setMessage(translate("incorrect_security_answer"));
          setIsSuccess(false);
        } else {
          setMessage(data.error || translate("problem_updating_password"));
          setIsSuccess(false);
        }
      }
    } catch (error) {
      // Si ocurre un error en la solicitud fetch
      setMessage(translate("problem_processing_request"));
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
      <HeaderLanguages></HeaderLanguages>
      <form onSubmit={handleSubmit}>
        <div className="forget-logo">
          <img src={LogoModaModerna} alt="logo" />
        </div>
        <h3>{translate("forget_password")}</h3>
        <div className="forget-dates">
          <input
            type="email"
            placeholder={translate("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={translate("new_password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h5>{translate("security_question")}</h5>
          <input
            type="text"
            placeholder={translate("answer_security")}
            value={answerSecurity}
            onChange={(e) => setAnswerSecurity(e.target.value)}
            required
          />
        </div>
        <div className="forget-info">
          <h5>
            {translate("if_you_forget_credentials")}
            <br />
            <a href="mailto:contacto@modaurbana.com">{translate("support")}</a>
          </h5>
        </div>
        <div className="submit">
          <button type="submit" disabled={isLoading}>
            {isLoading ? translate("loading") : translate("submit")}
          </button>
        </div>
      </form>
      {/* Ventana Modal usando ReactDOM.createPortal */}
      {ReactDOM.createPortal(
        <ModalForget
          visible={modalVisible}
          header={isSuccess ? translate("success") : translate("error")}
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
