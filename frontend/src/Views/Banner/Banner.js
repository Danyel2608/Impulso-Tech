import "./Banner.css";
import VideoBanner from "../../assets/Video.mp4";

function Banner() {
  return (
    <div className="banner-content">
      <video autoPlay loop muted>
        <source src={VideoBanner} type="video/mp4" />
      </video>
    </div>
  );
}

export default Banner;
