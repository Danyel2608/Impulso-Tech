import "./SignUpForm.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgLeft from "../../assets/mm1.jpg";
import { useRef } from "react";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción
import HeaderLanguages from "../Header/HeaderLanguages";

function SignUpForm(props) {
  const { translate } = useTranslation(); // Accedemos a la función de traducción
  const refEmail = useRef("");
  const refPassword = useRef("");
  const refName = useRef("");
  const refLastName = useRef("");
  const refAnswerPrivate = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      email: refEmail.current.value,
      password: refPassword.current.value,
      name: refName.current.value,
      lastName: refLastName.current.value,
      answerPrivate: refAnswerPrivate.current.value,
    };
    props.onLogin(loginData);
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
          <input
            ref={refPassword}
            type="password"
            placeholder={translate("password")}
            required
          />
        </div>
        <div className="answer-security">
          <h5>{translate("security_question")}</h5>{" "}
          {/* Traducimos la pregunta de seguridad */}
          <input
            ref={refAnswerPrivate}
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
      <div className="img-left">
        <img src={ImgLeft} alt="img-left" />
      </div>
    </div>
  );
}

export default SignUpForm;
