import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import "./ForgetPassword.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgLeft3 from "../../assets/Description3.jpg";
import ModalForget from "../Modal/ModalForget";
import { useTranslation } from "../../TranslationContext";
import HeaderLanguages from "../Header/HeaderLanguages";

function ForgetPassword() {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState(""); // Para almacenar la pregunta de seguridad
  const [showPassword, setShowPassword] = useState(false);
  const { translate } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseSecurity, setResponseSecurity] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (email) {
      // Solicitamos la pregunta de seguridad solo si el email ha sido ingresado
      const fetchSecurityQuestion = async () => {
        try {
          const response = await fetch(`/auth/user-data?email=${email}`);
          const data = await response.json();
          if (data.question) {
            setSelectedQuestion(data.question); // Establecemos la pregunta de seguridad
          } else {
            setSelectedQuestion(""); // No se encontró la pregunta
          }
        } catch (error) {
          console.error("Error fetching security question:", error);
        }
      };

      fetchSecurityQuestion();
    } else {
      setSelectedQuestion(""); // Restablecer si no hay email
    }
  }, [email]); // Esta función se ejecutará cada vez que el email cambie

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Invierte el estado de visibilidad
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !responseSecurity) {
      setMessage(translate("complete_all_fields"));
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      setPending(true);
      const response = await fetch("/auth/forget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          responseSecurity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(translate("password_updated_successfully"));
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        if (data.error && data.error.includes("respuesta incorrecta")) {
          setMessage(translate("incorrect_security_answer"));
          setIsSuccess(false);
        } else {
          setMessage(data.error || translate("problem_updating_password"));
          setIsSuccess(false);
        }
      }
    } catch (error) {
      setMessage(translate("problem_processing_request"));
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setPending(false);
      setModalVisible(true);
    }
  };

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
            onChange={(e) => setEmail(e.target.value)} // Guardamos el email en el estado
            required
          />
          <div className="password-container-forget">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={translate("new_password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <h5>{selectedQuestion || translate("security_question")}</h5>
          <input
            type="text"
            placeholder={translate("answer_security")}
            value={responseSecurity}
            onChange={(e) => setResponseSecurity(e.target.value)}
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
      {ReactDOM.createPortal(
        <ModalForget
          visible={modalVisible}
          header={isSuccess ? translate("success") : translate("error")}
          message={message}
          isSuccess={isSuccess}
          onClose={handleCloseModal}
        />,
        document.getElementById("modal")
      )}
      <div className="img-left">
        <img src={ImgLeft3} alt="img-left3" />
      </div>
    </div>
  );
}

export default ForgetPassword;
