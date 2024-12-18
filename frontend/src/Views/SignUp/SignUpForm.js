import "./SignUpForm.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgRight from "../../assets/mm1.jpg";
import { useRef, useState } from "react";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción
import HeaderLanguages from "../Header/HeaderLanguages";

function SignUpForm(props) {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { translate } = useTranslation(); // Accedemos a la función de traducción
  const refEmail = useRef("");
  const refPassword = useRef("");
  const refName = useRef("");
  const refLastName = useRef("");
  const refResponsePrivate = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      email: refEmail.current.value,
      password: refPassword.current.value,
      name: refName.current.value,
      lastName: refLastName.current.value,
      answerPrivate: selectedQuestion,
      responsePrivate: refResponsePrivate.current.value,
    };
    console.log(loginData);
    props.onLogin(loginData);
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    const input = refPassword.current;
    if (input) {
      setShowPassword(!showPassword); // Cambia el estado
      input.type = showPassword ? "password" : "text"; // Cambia el tipo del input
    }
  };

  return (
    <div className="signup-content">
      <HeaderLanguages></HeaderLanguages>
      <form action="register" onSubmit={handleSubmit}>
        <div className="signup-logo">
          <img src={LogoModaModerna} alt="logo" />
        </div>
        <h3>{translate("sign_up")}</h3> {/* Traducimos el título */}
        <div className="signup-dates">
          <input
            ref={refName}
            type="text"
            placeholder={translate("name")}
            required
          />
          <input
            ref={refLastName}
            type="text"
            placeholder={translate("last_name")}
            required
          />
          <input
            ref={refEmail}
            type="email"
            placeholder={translate("email")}
            required
          />
          <div className="password-container-register">
            <input
              ref={refPassword}
              type="password"
              placeholder={translate("password")}
              required
            />
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} // Cambia entre fa-eye y fa-eye-slash
              onClick={togglePasswordVisibility} // Llama a la función cuando se hace clic
            ></i>
          </div>
        </div>
        <div className="answer-security">
          <div className="security-question-container">
            <label htmlFor="security-question">
              {translate("select_security_question")}{" "}
              {/* Texto para la etiqueta */}
            </label>
            <select
              id="security-question"
              value={selectedQuestion} // El valor seleccionado
              onChange={(e) => setSelectedQuestion(e.target.value)} // Manejador de cambio
              required
              className="security-question-select"
            >
              <option value="" disabled>
                {translate("choose_question")} {/* Placeholder */}
              </option>
              <option value={translate("security_question_1")}>
                {translate("security_question_1")}
              </option>
              <option value={translate("security_question_2")}>
                {translate("security_question_2")}
              </option>
              <option value={translate("security_question_3")}>
                {translate("security_question_3")}
              </option>
              <option value={translate("security_question_4")}>
                {translate("security_question_4")}
              </option>
              <option value={translate("security_question_5")}>
                {translate("security_question_5")}
              </option>
            </select>
          </div>
          {/* Traducimos la pregunta de seguridad */}
          <input
            ref={refResponsePrivate}
            type="text"
            name="answerSecurity"
            id="answerSecurity"
            placeholder={translate("write_here")}
            required
          />
        </div>
        <div className="login-link">
          <a href="/login">
            {translate("already_have_account")}{" "}
            <strong>{translate("log_in_here")}</strong>{" "}
            {/* Traducimos el enlace */}
          </a>
        </div>
        <div className="submit">
          <button type="submit">{translate("submit")}</button>{" "}
          {/* Traducimos el botón de envío */}
        </div>
      </form>
      <div className="img-right-register">
        <img src={ImgRight} alt="img-right-register" />
      </div>
    </div>
  );
}

export default SignUpForm;
