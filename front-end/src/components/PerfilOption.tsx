import { Link } from "react-router-dom";
import "../css/perfiloptions.css";

import backArrow from "../assets/icons/backArrow.png";

type perfilOptionProps = {
  title: string;
  icon: string;
  link?: string;
  onClick?: () => void;
  isButton?: boolean;
};

const PerfilOptions = ({ title, icon, link, onClick, isButton }: perfilOptionProps) => {
  return (
    <>
      {isButton ? (
        <button onClick={onClick} className="link-names option-button">
          <div className="top-container-option">
            <div className="container-option">
              <div>
                <img src={icon} alt="Icon" className="option-icon-adjust" />
                <p>{title}</p>
              </div>
              <div>
                <img src={backArrow} alt="Ir" className="inverter" />
              </div>
            </div>
          </div>
        </button>
      ) : (
        <Link to={link!} className="link-names">
          <div className="top-container-option">
            <div className="container-option">
              <div>
                <img src={icon} alt="Icon" className="option-icon-adjust" />
                <p>{title}</p>
              </div>
              <div>
                <img src={backArrow} alt="Ir" className="inverter" />
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default PerfilOptions;