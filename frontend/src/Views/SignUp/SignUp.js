import { useState } from "react";
import ReactDOM from "react-dom";
import ModalRegister from "../Modal/ModalRegister";
import {
  validatePassword,
  validateEmail,
  validateName,
} from "../../utils/validate";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../UI/Spinners/LoadingIndicator";
import SignUpForm from "./SignUpForm";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción

function SignUp() {
  const { translate } = useTranslation(); // Accedemos a la función de traducción
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    loggedIn: false,
    email: "",
    password: "",
    name: "",
    loginHeader: "",
    loginMessage: "",
  });

  const handleVisibility = async (loginData) => {
    if (
      loginData &&
      validateEmail(loginData.email) &&
      validatePassword(loginData.password) &&
      validateName(loginData.name)
    ) {
      setPending(true);
      try {
        const response = await fetch("/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            name: loginData.name,
            lastName: loginData.lastName,
            answerPrivate: loginData.answerPrivate,
            responsePrivate: loginData.responsePrivate,
            confirmEmail: false,
          }),
        });

        if (response.ok) {
          setLoginInfo({
            loggedIn: true,
            email: loginData.email,
            password: "*******",
            name: loginData.name,
            loginHeader: translate("register_success"),
            loginMessage: translate("confirmation_email_sent"),
          });
          setVisible(true);
        } else {
          const errorData = await response.json();
          setLoginInfo({
            loggedIn: false,
            loginHeader: translate("registration_failed"),
            loginMessage: errorData.error,
          });
          setVisible(true);
        }
      } catch (error) {
        setLoginInfo({
          loggedIn: false,
          email: loginData.email,
          password: "*******",
          name: loginData.name,
          loginHeader: translate("register_failed"),
          loginMessage: error.message,
        });
      }
      setPending(false);
    } else if (
      loginData.email === "" ||
      loginData.password === "" ||
      loginData.name === "" ||
      loginData.lastName === ""
    ) {
      setLoginInfo({
        loggedIn: false,
        loginHeader: translate("register_failed"),
        loginMessage: translate("all_fields_required"),
      });
    } else if (!validatePassword(loginData.password)) {
      setLoginInfo({
        loggedIn: false,
        email: loginData.email,
        password: "*******",
        name: loginData.name,
        lastName: loginData.lastName,
        loginHeader: translate("invalid_password"),
        loginMessage: translate("password_requirements"),
      });
    } else {
      setLoginInfo({
        loggedIn: false,
        email: loginData.email,
        password: "*******",
        name: loginData.name,
        lastName: loginData.lastName,
        loginHeader: translate("register_failed"),
        loginMessage: translate("wrong_email_password_name"),
      });
    }
    setVisible(!visible);
  };

  return (
    <div>
      {ReactDOM.createPortal(
        <ModalRegister
          visible={visible}
          onLogin={handleVisibility}
          data={loginInfo}
        />,
        document.querySelector("#modal")
      )}
      {pending ? (
        <LoadingIndicator />
      ) : (
        <div className="container">
          <SignUpForm onLogin={handleVisibility} />
        </div>
      )}
    </div>
  );
}

export default SignUp;
