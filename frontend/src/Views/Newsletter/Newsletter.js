import "./Newsletter.css";
import NewsletterImg from "../../assets/newsletter.jpg";
import { useTranslation } from "../../TranslationContext"; // Importamos el contexto de traducción

function Newsletter() {
  const { translate } = useTranslation(); // Accedemos a la función de traducción

  return (
    <div className="newsletter-content">
      <img src={NewsletterImg} alt="NewsletterImg" />
      <h3>
        <a href="/newsletter">{translate("join_newsletter")}</a>
      </h3>
    </div>
  );
}

export default Newsletter;
