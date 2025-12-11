import LogojcCentralizada from "../components/LogojcCentralizada";
import { ButtonRed } from "../components/MoreNewsButton"
import { useNavigate } from "react-router-dom";

import "../css/mensagemenviada.css"

const MensagemEnviada = () => {
    const navigate = useNavigate();
    const handleClick = () => {
    navigate("/");
  };
    return (
        <div className="mensagem-enviada-container">
            <LogojcCentralizada/>
            <div className="text-mensagem-enviada">
                <h1>Sua mensagem foi enviada!</h1>
                <p>em breve entraremos em contato via email.</p>
            </div>
            <ButtonRed buttonText="Inicio" onClick={handleClick}/>
        </div>
    )
}

export default MensagemEnviada