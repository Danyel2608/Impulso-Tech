import classes from "./Modal.module.css";

function ModalRegister(props) {
  return (
    <>
      <div
        className={`${classes["md-modal"]} ${classes["modal-effect"]}} ${
          props.visible && classes["md-show"]
        }`}
      >
        <div
          className={`${classes["md-content"]} ${
            props.data.loggedIn ? classes.success : classes.danger
          }`}
        >
          <h3>{props.data.loginHeader}</h3>
          <div>
            <p>{props.data.loginMessage}</p>
            <ul>
              <li>
                <strong>Email:</strong>
                {props.data.email}
              </li>
              <li>
                <strong>Password:</strong>
                {props.data.password}
              </li>
              <li>
                <strong>Name:</strong>
                {props.data.name}
              </li>
              <li>
                <strong>Last Name:</strong>
                {props.data.lastName}
              </li>
            </ul>
            <button onClick={props.onLogin} className={classes["md-close"]}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className={classes["md-overlay"]} />
    </>
  );
}

export default ModalRegister;
