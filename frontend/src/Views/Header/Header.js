import "./Header.css";
import ModaUrbanaLogo from "../../assets/ModaUrbanaLogo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Adidas from "../../assets/marcas/Adidas.jpg";
import Nike from "../../assets/marcas/Nike.jpg";
import Puma from "../../assets/marcas/Puma.png";
import Supreme from "../../assets/marcas/Supreme.png";
import Vans from "../../assets/marcas/Vans.jpg";
import ShoppingCart from "../ShoppingCart/ShoppingCart";

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
  const openCart = () => {
    let shoppingCart = document.getElementById("shopping-cart");
    shoppingCart.classList.remove("invisible");
    shoppingCart.classList.add("visible");
  };
  return (
    <div className="header-content">
      <ShoppingCart></ShoppingCart>
      <div className="header-menu">
        <i className="fa-solid fa-bars" onClick={openMenu}></i>
        <img src={ModaUrbanaLogo} alt="moda-urbana-logo" onClick={() => navigate("/")}></img>
        <i className="fa-solid fa-user" onClick={goLogin}></i>
        <i className="fa-solid fa-cart-shopping" onClick={openCart}></i>
      </div>
      <div className="header-links invisible" id="menu-header">
        <i className="fa-solid fa-xmark" onClick={closeMenu}></i>
        <a href="/products">TODOS LOS PRODUCTOS</a>
        <a href="#" onClick={toggleMarcas}>
          MARCAS
        </a>
        {/* Aquí se alterna la clase "invisible" y "visible" basado en el estado */}
        <div
          className={`marcas-list ${isMarcasVisible ? "visible" : "invisible"}`}
          id="marcas-list"
        >
          <a href="/marcas/nike">
            <img src={Nike} alt="Nike"></img>
          </a>
          <a href="/marcas/adidas">
            <img src={Adidas} alt="Adidas"></img>
          </a>
          <a href="/marcas/supreme">
            <img src={Supreme} alt="Supreme"></img>
          </a>
          <a href="/marcas/puma">
            <img src={Puma} alt="Puma"></img>
          </a>
          <a href="/marcas/vans">
            <img src={Vans} alt="Vans"></img>
          </a>
        </div>
        <a href="/categorias/hombre">HOMBRE</a>
        <a href="/categorias/mujer">MUJER</a>
        <a href="/categorias/niño">NIÑO</a>
        <a href="/accesorios">ACCESORIOS</a>
        <a href="/novedades">NOVEDADES</a>
        <a href="/rebajas">REBAJAS</a>
      </div>
    </div>
  );
}

export default Header;
