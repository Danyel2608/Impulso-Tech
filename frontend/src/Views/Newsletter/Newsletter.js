import "./Newsletter.css";
import NewsletterImg from "../../assets/newsletter.jpg";

function Newsletter() {
  return (
    <div className="newsletter-content">
      <img src={NewsletterImg} alt="NewsletterImg" />
      <h3>
        <a href="/newsletter">Únete a nuestra newsletter</a>
      </h3>
    </div>
  );
}

export default Newsletter;
