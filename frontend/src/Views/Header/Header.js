import "./Header.css";
import ModaUrbanaLogo from "../../assets/ModaUrbanaLogo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Adidas from "../../assets/marcas/Adidas.jpg";
import Nike from "../../assets/marcas/Nike.jpg";
import Puma from "../../assets/marcas/Puma.png";
import Supreme from "../../assets/marcas/Supreme.png";
import Vans from "../../assets/marcas/Vans.jpg";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import HeaderLanguages from "./HeaderLanguages";
import { useTranslation } from "../../TranslationContext";

function Header() {
  const { translate } = useTranslation(); // Accedemos a la función de traducción
  const navigate = useNavigate();
  const [isMarcasVisible, setIsMarcasVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // Nuevo estado para el rol

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const roleUser = localStorage.getItem("user");
      if (roleUser) {
        try {
          const parsedRoleUser = JSON.parse(roleUser);
          const userRole = parsedRoleUser?.data?.user?.role || "";
          setRole(userRole);
        } catch (error) {
          console.error("Error al parsear el usuario:", error);
          setRole("");
        }
      }
    }
  }, []);

  const openMenu = () => {
    const menu = document.getElementById("menu-header");
    menu.classList.remove("invisible");
    menu.classList.add("visible");
  };

  const closeMenu = () => {
    const menu = document.getElementById("menu-header");
    menu.classList.remove("visible");
    menu.classList.add("invisible");
  };

  const goLogin = () => {
    navigate("/login");
  };

  const toggleMarcas = () => {
    setIsMarcasVisible(!isMarcasVisible);
  };

  const openCart = () => {
    const shoppingCart = document.getElementById("shopping-cart");
    shoppingCart.classList.remove("invisible");
    shoppingCart.classList.add("visible");
  };

  const closeSession = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(""); // Reiniciar el rol al cerrar sesión
    const shoppingCart = document.querySelector("#listItems");
    shoppingCart.innerHTML = "";
  };

  return (
    <div className="header-content">
      <ShoppingCart />
      <HeaderLanguages />

      {isLoggedIn && (
        <div className="logout visible" onClick={closeSession}>
          <p>{translate("close_sesion")}</p> {/* Traducible */}
        </div>
      )}

      <div className="header-menu">
        <i className="fa-solid fa-bars" onClick={openMenu}></i>
        <img
          src={ModaUrbanaLogo}
          alt="moda-urbana-logo"
          onClick={() => navigate("/")}
        />
        {!isLoggedIn && <i className="fa-solid fa-user" onClick={goLogin}></i>}
        <i className="fa-solid fa-cart-shopping" onClick={openCart}></i>
      </div>

      <div className="header-links invisible" id="menu-header">
        <i className="fa-solid fa-xmark" onClick={closeMenu}></i>
        <a href="/products">{translate("all_products")}</a>
        <a href="#" onClick={toggleMarcas}>
          {translate("brands")}
        </a>
        <div
          className={`marcas-list ${isMarcasVisible ? "visible" : "invisible"}`}
          id="marcas-list"
        >
          <a href="/marcas/nike">
            <img src={Nike} alt="Nike" />
          </a>
          <a href="/marcas/adidas">
            <img src={Adidas} alt="Adidas" />
          </a>
          <a href="/marcas/supreme">
            <img src={Supreme} alt="Supreme" />
          </a>
          <a href="/marcas/puma">
            <img src={Puma} alt="Puma" />
          </a>
          <a href="/marcas/vans">
            <img src={Vans} alt="Vans" />
          </a>
        </div>
        <a href="/categorias/hombre">{translate("men")}</a>
        <a href="/categorias/mujer">{translate("women")}</a>
        <a href="/categorias/niño">{translate("children")}</a>
        <a href="/accesorios">{translate("accessories")}</a>
        <a href="/novedades">{translate("novelties")}</a>
        <a href="/rebajas">{translate("sales")}</a>
        {isLoggedIn && role === "admin" && <a href="/admin">Admin</a>}
      </div>
    </div>
  );
}

export default Header;
