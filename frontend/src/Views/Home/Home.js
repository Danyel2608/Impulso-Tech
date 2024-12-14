import Banner from "../Banner/Banner";
import Description from "../Description/Description";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Newsletter from "../Newsletter/Newsletter";
import ChatBoot from "./Chatboot/ChatBoot";
import "./Home.css";

function Home() {
  return (
    <div className="home-moda-urbana">
      <ChatBoot></ChatBoot>
      <Header></Header>
      <Banner></Banner>
      <Description></Description>
      <Newsletter></Newsletter>
      <Footer></Footer>
    </div>
  );
}

export default Home;
