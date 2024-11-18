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

function SignUp() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
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
      validatePassword(loginData.password) &&
      validateName(loginData.Name)
    ) {
      setPending(true);
      //Peticion a backend
      try {
        const response = await fetch("http://localhost:8001/auth/signup", {
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
            confirmEmail: false,
          }),
        });
        //Si todo a ido bien,redirigir al login,para logearte.
        if (response.ok) {
          setLoginInfo({
            loggedIn: true,
            email: loginData.email,
            password: "*******",
            name: loginData.name,
            loginHeader: "Register succesfully",
            loginMessage:
              "A confirmation email has been sent to your email address. Please verify your email before logging in.",
          });
          setVisible(true);
        } else {
          // Capturar el error y mostrarlo por el modal
          const errorData = await response.json();
          setLoginInfo({
            loggedIn: false,
            loginHeader: "Registration failed",
            loginMessage: errorData.error,
          });
          setVisible(true);
        }
        //Captar el error y mostrarlo por el modal
      } catch (error) {
        setLoginInfo({
          loggedIn: false,
          email: loginData.email,
          password: "*******",
          name: loginData.name,
          loginHeader: "Register failed",
          loginMessage: error.message,
        });
      }
      setPending(false);
      //Validaciones de campos que no esten vacios
    } else if (
      loginData.email === "" ||
      loginData.password === "" ||
      loginData.name === "" ||
      loginData.lastName === ""
    ) {
      setLoginInfo({
        loggedIn: false,
        loginHeader: "Register failed",
        loginMessage: "All fields are required",
      });
      //Si los demás campos están bien pero la contraseña no cumple los requisitos.
    } else if (!validatePassword(loginData.password)) {
      setLoginInfo({
        loggedIn: false,
        email: loginData.email,
        password: "*******",
        name: loginData.name,
        lastName: loginData.lastName,
        loginHeader: "Invalid Password",
        loginMessage:
          "La contraseña debe : Tener al menos una letra minúscula,Tener al menos una letra mayúscula,Tener al menos un dígito,Tener al menos uno de los caracteres especiales $, @, !, %, *, ? o &,Tener una longitud entre 3 y 15 caracteres.",
      });
      //Si la contraseña o email o name están mal
    } else {
      setLoginInfo({
        loggedIn: false,
        email: loginData.email,
        password: "*******",
        name: loginData.name,
        lastName: loginData.lastName,
        loginHeader: "Register failed",
        loginMessage: "Wrong password or email or name",
      });
    }
    setVisible(!visible);
  };

  return (
    <div>
      {/* Ventana Modal  */}
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
