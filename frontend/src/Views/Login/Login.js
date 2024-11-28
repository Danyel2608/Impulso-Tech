import LoginForm from "./LoginForm";
import { useState } from "react";
import ReactDOM from "react-dom";
import Modal from "../Modal/Modal";
import { validatePassword, validateEmail } from "../../utils/validate";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../UI/Spinners/LoadingIndicator";

function Login({ onLogin }) {
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
      //Peticion a backend
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
        //Si todo ha ido bien, guardarlo en el LocalStorage y devolver el estado
        //ok con setLoginInfo, con la información que verá el usuario
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
            loginHeader: "Login succesfully",
            loginMessage: "You may by redirected to Perpetual Home",
          });
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            // Llama a la función onLogin proporcionada desde App.js
            //para indicar que el inicio de sesión fue exitoso
            onLogin(data.data.token, data.data.user.role);
            if (data.data.user.role === "admin") {
              navigate("/admin");
            } else {
              // Redirige al usuario a /home
              navigate("/userHome");
            }
          }, 3000);
        }
      } catch (error) {
        setLoginInfo({
          loggedIn: false,
          email: loginData.email,
          password: "*******",
          rememberMe: loginData.rememberMe,
          loginHeader: "Login failed",
          loginMessage: error.message,
        });
      }
      setPending(false);
    } else {
      //si algun campo está vacio o el correo no está verificado
      setTimeout(() => {
        setLoginInfo({
          loggedIn: false,
          email: loginData.email === "" ? "Email required" : loginData.email,
          password:
            loginData.password === ""
              ? "Password required"
              : loginData.password,
          rememberMe: loginData.rememberMe,
          loginHeader: "Login failed",
          loginMessage:
            "Wrong email or password, or the email has not been verified yet",
        });
      }, 2000);
    }
    setVisible(!visible);
  };

  return (
    <div>
      {/* Venatana modal login */}
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
          ></LoginForm>
        </div>
      )}
      ;
    </div>
  );
}

export default Login;
