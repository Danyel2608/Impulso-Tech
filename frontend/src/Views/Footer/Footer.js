import "./Footer.css";

function Footer() {
  return (
    <div className="footer-content">
      <h2>Moda Urbana</h2>
      <p>Conéctate con nosotros:</p>
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
        <a href="/privacy-policy">Política de Privacidad</a>
        <a href="/terms-of-service">Términos de Servicio</a>
        <a href="/about">Sobre Nosotros</a>
      </div>

      <p>&copy; 2024 Moda Urbana. Todos los derechos reservados.</p>
    </div>
  );
}

export default Footer;
