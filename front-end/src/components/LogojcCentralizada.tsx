import "../css/logojccentralizada.css";

import LogoJC from "../assets/imgs/Logo JC.png";

import { Link } from "react-router-dom";

const LogojcCentralizada = () => {
  return (
    <>
      <Link to="/" className="logojcCentralizada">
        <img src={LogoJC} alt="Logo JC" />
      </Link>
    </>
  );
};

export default LogojcCentralizada;
