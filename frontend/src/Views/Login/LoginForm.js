import "./LoginForm.css";
import { useRef } from "react";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgLeft2 from "../../assets/mm2.jpg";

function LoginForm(props) {
  const refEmail = useRef("");
  const refPassword = useRef("");
  const refCheckbox = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      email: refEmail.current.value,
      password: refPassword.current.value,
      rememberMe: refCheckbox.current.checked,
    };
    props.onLogin(loginData);
  };

  return (
    <div className="login-content">
      <form action="login" onSubmit={handleSubmit}>
        <div className="login-logo">
          <img src={LogoModaModerna} alt="logo" />
        </div>
        <h3>Login</h3>
        <div className="login-dates">
          <input ref={refEmail} type="email" placeholder="Email" required />
          <input
            ref={refPassword}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="login-links">
          <div className="remember-me">
            <input
              ref={refCheckbox}
              type="checkbox"
              name="remember"
              id="remember"
            />
            <h5>Remember me</h5>
          </div>
          <div className="forget-password">
            <a href="/forget">Reset your password</a>
          </div>
        </div>
        <div className="sign-up">
          <a href="/sign-up">Create an Account</a>
        </div>
        <div className="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      <div className="img-left">
        <img src={ImgLeft2} alt="img-left2" />
      </div>
    </div>
  );
}

export default LoginForm;
