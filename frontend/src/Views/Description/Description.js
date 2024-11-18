import "./Description.css";
import Description1 from "../../assets/Description1.jpg";
import Description2 from "../../assets/Description2.jpg";
import Description3 from "../../assets/Description3.jpg";
import Description4 from "../../assets/Description4.jpg";
function Description() {
  return (
    <div className="description-content">
      <h2>¿Cómo surgió Moda Urbana?</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. A repellendus
        impedit corrupti aperiam non iusto ea facere nobis, repudiandae alias
        facilis error iste labore optio sunt rem et sed. Sunt?
      </p>
      <div className="description-imgs">
        <img src={Description1} alt="Description1" />
        <img src={Description2} alt="Description2" />
        <img src={Description3} alt="Description3" />
        <img src={Description4} alt="Description4" />
      </div>
    </div>
  );
}

export default Description;
