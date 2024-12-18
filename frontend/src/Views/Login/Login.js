import { useState } from "react";
import ReactDOM from "react-dom";
import Modal from "../Modal/Modal";
import { validatePassword, validateEmail } from "../../utils/validate";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../UI/Spinners/LoadingIndicator";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción
import LoginForm from "./LoginForm";

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

  // Función para cerrar el modal
  const closeModal = () => {
    setVisible(false);
  };

  const handleVisibility = async (loginData) => {
    if (
      loginData &&
      validateEmail(loginData.email) &&
      validatePassword(loginData.password)
    ) {
      setPending(true);
      try {
        const response = await fetch("/auth/login", {
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

        //Si todo ha ido bien, guardarlo en el LocalStorage y devolver el estado
        //ok con setLoginInfo, con la información que verá el usuario
        if (response.ok) {
          setLoggedIn(true);
          if (loginData.rememberMe) {
            localStorage.setItem("user", JSON.stringify(data));
          }
          localStorage.setItem("user", JSON.stringify(data));
          onLogin(data.data.token,data.data.refreshToken, data.data.user.role);
          setLoginInfo({
            loggedIn: true,
            email: loginData.email,
            password: "*******",
            rememberMe: loginData.rememberMe,
            loginHeader: "Login succesfully",
            loginMessage: "You may by redirected to Perpetual Home",
          });
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            // Llama a la función onLogin proporcionada desde App.js
            //para indicar que el inicio de sesión fue exitoso
            onLogin(data.data.token,data.data.refreshToken, data.data.user.role);
            if (data.data.user.role === "admin") {
              navigate("/admin");
            } else {
              // Redirige al usuario a /home
              navigate("/home");
            }
          }, 3000);
        }
      } catch (error) {
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
      setLoginInfo({
        loggedIn: false,
        email:
          loginData.email === ""
            ? translate("email_required")
            : loginData.email,
        password:
          loginData.password === ""
            ? translate("password_required")
            : loginData.password,
        rememberMe: loginData.rememberMe,
        loginHeader: translate("login_failed"),
        loginMessage: translate("wrong_email_or_password"),
      });
    }
    setVisible(true); // Asegúrate de mostrar el modal
  };

  return (
    <div>
      {ReactDOM.createPortal(
        <Modal
          visible={visible}
          onClose={closeModal} // Pasamos la función para cerrar el modal
          data={loginInfo}
        />,
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
