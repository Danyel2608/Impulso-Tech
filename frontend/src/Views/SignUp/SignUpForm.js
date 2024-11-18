import "./SignUpForm.css";
import LogoModaModerna from "../../assets/ModaUrbanaLogo.png";
import ImgLeft from "../../assets/mm1.jpg";
import { useRef } from "react";

function SignUpForm(props) {
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
      <form action="register" onSubmit={handleSubmit}>
        <div className="signup-logo">
          <img src={LogoModaModerna} alt="logo" />
        </div>
        <h3>sign up</h3>
        <div className="signup-dates">
          <input ref={refName} type="text" placeholder="Name" required />
          <input
            ref={refLastName}
            type="text"
            placeholder="Last Name"
            required
          />
          <input ref={refEmail} type="email" placeholder="Email" required />
          <input
            ref={refPassword}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="answer-security">
          <h5>What was the name of your school?</h5>
          <input
            ref={refAnswerPrivate}
            type="text"
            name="answerSecurity"
            id="answerSecurity"
            placeholder="Write here"
            required
          />
        </div>
        <div className="login-link">
          <a href="/login">
            Already have an account? <strong>Log in here.</strong>
          </a>
        </div>
        <div className="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      <div className="img-left">
        <img src={ImgLeft} alt="img-left" />
      </div>
    </div>
  );
}

export default SignUpForm;
