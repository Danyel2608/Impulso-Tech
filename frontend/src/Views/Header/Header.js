import "./Header.css";
import ModaUrbanaLogo from "../../assets/ModaUrbanaLogo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();

  const [isMarcasVisible, setIsMarcasVisible] = useState(false); // Estado para controlar la visibilidad de marcas

  const openMenu = () => {
    let menu = document.getElementById("menu-header");
    menu.classList.remove("invisible");
    menu.classList.add("visible");
  };
  const closeMenu = () => {
    let menu = document.getElementById("menu-header");
    menu.classList.remove("visible");
    menu.classList.add("invisible");
  };
  const goLogin = () => {
    navigate("/login");
  };

  const toggleMarcas = () => {
    setIsMarcasVisible(!isMarcasVisible); // Alterna entre visible/invisible
  };

  return (
    <div className="header-content">
      <div className="header-menu">
        <i className="fa-solid fa-bars" onClick={openMenu}></i>
        <img src={ModaUrbanaLogo} alt="moda-urbana-logo" />
        <i className="fa-solid fa-user" onClick={goLogin}></i>
        <i className="fa-solid fa-cart-shopping"></i>
      </div>
      <div className="header-links invisible" id="menu-header">
        <i className="fa-solid fa-xmark" onClick={closeMenu}></i>
        <a href="#" onClick={toggleMarcas}>
          MARCAS
        </a>
        {/* Aquí se alterna la clase "invisible" y "visible" basado en el estado */}
        <div
          className={`marcas-list ${isMarcasVisible ? "visible" : "invisible"}`}
          id="marcas-list"
        >
          <a href="/nike">NIKE</a>
          <a href="/adidas">ADIDAS</a>
          <a href="/supreme">SUPREME</a>
          <a href="/puma">PUMA</a>
          <a href="/vans">VANS</a>
        </div>
        <a href="#">HOMBRE</a>
        <a href="#">MUJER</a>
        <a href="#">NIÑO</a>
        <a href="#">ACCESORIOS</a>
        <a href="#">NOVEDADES</a>
        <a href="#">REBAJAS</a>
      </div>
    </div>
  );
}

export default Header;
