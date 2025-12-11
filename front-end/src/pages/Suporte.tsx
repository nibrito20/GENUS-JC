import "../css/suporte.css";

import { ButtonRed } from "../components/MoreNewsButton";
import { useNavigate } from "react-router-dom";

import LogojcCentralizada from "../components/LogojcCentralizada";
import SuporteImage from "../assets/imgs/suport-image.png"
import BackArrow from "../assets/icons/backArrow.png"

const Suporte = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/perfil/suporte/mensagem-enviada");
  };

  return (
    <div className="suport-container">
      <LogojcCentralizada/>
      <i><img src={BackArrow} alt="Voltar" /></i>
      <img src={SuporteImage} alt="Imagem do suporte" />
      <h1>Descricao do problema</h1>
      <textarea name="texto-para-suporte" id="suportTextArea" placeholder="Escreva aqui..."></textarea>
      <ButtonRed buttonText="Enviar" onClick={handleClick} />
    </div>
  );
};

export default Suporte;
