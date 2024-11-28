import "./UserHome.css";

function UserHome() {
  function closeSession() {
    localStorage.removeItem("token");
  }
  return (
    <div className="userHome-page">
      Esta es la página de userHome
      <button onClick={closeSession}>Cerrar sesión</button>
    </div>
  );
}

export default UserHome;
