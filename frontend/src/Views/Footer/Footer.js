import "./Footer.css";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción

function Footer() {
  const { translate } = useTranslation(); // Accedemos a la función de traducción

  return (
    <div className="footer-content">
      <h2>Moda Urbana</h2>
      <p>{translate("connect_with_us")}</p>{" "}
      {/* Traducción del texto de conexión */}
      <div className="social-icons">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-tiktok"></i>
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-twitter"></i>
        </a>
      </div>
      <div className="contact-info">
        <a href="tel:+1234567890">
          <i className="fas fa-phone"></i> +1 (234) 567-890
        </a>
        <a href="mailto:contacto@modaurbana.com">
          <i className="fas fa-envelope"></i> contacto@modaurbana.com
        </a>
      </div>
      <div className="footer-links">
        <a href="/privacy-policy">{translate("privacy_policy")}</a>{" "}
        {/* Traducción del enlace de política de privacidad */}
        <a href="/terms-of-service">{translate("terms_of_service")}</a>{" "}
        {/* Traducción del enlace de términos de servicio */}
        <a href="/about">{translate("about_us")}</a>{" "}
        {/* Traducción del enlace sobre nosotros */}
      </div>
      <p>&copy; 2024 Moda Urbana. {translate("all_rights_reserved")}</p>{" "}
      {/* Traducción del texto de derechos reservados */}
    </div>
  );
}

export default Footer;
