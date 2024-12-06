import LoginForm from "./LoginForm";
import { useState } from "react";
import ReactDOM from "react-dom";
import Modal from "../Modal/Modal";
import { validatePassword, validateEmail } from "../../utils/validate";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../UI/Spinners/LoadingIndicator";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción

function Login({ onLogin }) {
  const { translate } = useTranslation(); // Accedemos a la función de traducción
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pending, setPending] = useState(false);

  const [loginInfo, setLoginInfo] = useState({
    loggedIn: false,
    email: "",
    password: "",
    rememberMe: false,
    loginHeader: "",
    loginMessage: "",
  });

  const handleVisibility = async (loginData) => {
    if (
      loginData &&
      validateEmail(loginData.email) &&
      validatePassword(loginData.password)
    ) {
      setPending(true);
      try {
        const response = await fetch("http://localhost:8001/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setLoggedIn(true);
          if (loginData.rememberMe) {
            localStorage.setItem("user", JSON.stringify(data));
          }
          localStorage.setItem("user", JSON.stringify(data));
          onLogin(data.data.token, data.data.user.role);
          setLoginInfo({
            loggedIn: true,
            email: loginData.email,
            password: "*******",
            rememberMe: loginData.rememberMe,
            loginHeader: translate("login_success"),
            loginMessage: translate("redirecting_home"),
          });
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            onLogin(data.data.token, data.data.user.role);
            if (data.data.user.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 3000);
        }
      } catch (error) {
        console.log(error);
        setLoginInfo({
          loggedIn: false,
          email: loginData.email,
          password: "*******",
          rememberMe: loginData.rememberMe,
          loginHeader: translate("login_failed"),
          loginMessage: error.message,
        });
      }
      setPending(false);
    } else {
      setTimeout(() => {
        setLoginInfo({
          loggedIn: false,
          email: loginData.email === "" ? translate("email_required") : loginData.email,
          password:
            loginData.password === ""
              ? translate("password_required")
              : loginData.password,
          rememberMe: loginData.rememberMe,
          loginHeader: translate("login_failed"),
          loginMessage: translate("wrong_email_or_password"),
        });
      }, 2000);
    }
    setVisible(!visible);
  };

  return (
    <div>
      {ReactDOM.createPortal(
        <Modal visible={visible} onLogin={handleVisibility} data={loginInfo} />,
        document.querySelector("#modal")
      )}
      {pending ? (
        <LoadingIndicator />
      ) : (
        <div className="container">
          <LoginForm
            onLogin={handleVisibility}
            isLoading={isLoading}
            loggedIn={loggedIn}
          />
        </div>
      )}
    </div>
  );
}

export default Login;
