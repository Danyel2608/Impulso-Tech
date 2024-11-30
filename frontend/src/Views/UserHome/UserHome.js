import "./UserHome.css";

function UserHome() {
  function closeSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("carrito");
    localStorage.removeItem("itemsCart");
  }
  return (
    <div className="userHome-page">
      Esta es la página de userHome
      <button onClick={closeSession}>Cerrar sesión</button>
    </div>
  );
}

export default UserHome;
