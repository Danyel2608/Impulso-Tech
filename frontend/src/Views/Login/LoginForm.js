import { useRef, useState } from "react";
import "./LoginForm.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgRight2 from "../../assets/mm2.jpg";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción
import HeaderLanguages from "../Header/HeaderLanguages";

function LoginForm(props) {
  const { translate } = useTranslation(); // Accedemos a la función de traducción
  const refCheckbox = useRef(false);
  const refEmail = useRef("");
  const refPassword = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      email: refEmail.current.value,
      password: refPassword.current.value,
      rememberMe: refCheckbox.current.checked, // Usamos el estado de rememberMe, esto está bien
    };
    props.onLogin(loginData);
  };

  return (
    <div className="login-content">
      <HeaderLanguages></HeaderLanguages>
      <form action="login" onSubmit={handleSubmit}>
        <div className="login-logo">
          <img src={LogoModaModerna} alt="logo" />
        </div>
        <h3>{translate("login")}</h3> {/* Traducción del título */}
        <div className="login-dates">
          <input
            ref={refEmail}
            type="email"
            placeholder={translate("email_placeholder")} // Traducción del placeholder
            required
          />
          <input
            ref={refPassword}
            type="password"
            placeholder={translate("password_placeholder")} // Traducción del placeholder
            required
          />
        </div>
        <div className="login-links">
          <div className="remember-me">
            <input ref={refCheckbox} type="checkbox" id="check1" />
            <label htmlFor="check1">Remeember me</label>{" "}
            {/* Traducción de "Remember me" */}
          </div>
          <div className="forget-password">
            <a href="/forget">{translate("reset_password")}</a>{" "}
            {/* Traducción de "Reset your password" */}
          </div>
        </div>
        <div className="sign-up">
          <a href="/sign-up">{translate("create_account")}</a>{" "}
          {/* Traducción de "Create an Account" */}
        </div>
        <div className="submit">
          <button type="submit">{translate("submit")}</button>{" "}
          {/* Traducción de "Submit" */}
        </div>
      </form>
      <div className="img-right">
        <img src={ImgRight2} alt="img-right2" />
      </div>
    </div>
  );
}

export default LoginForm;
