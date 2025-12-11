import { ButtonRed } from "../components/MoreNewsButton"
import { useNavigate } from "react-router-dom";



const MensagemEnviada = () => {
    const navigate = useNavigate();
    const handleClick = () => {
    navigate("/mensagem-enviada");
  };
    return (
        <div>
            <img src="" alt="" />
            <div>
                <h1>Sua mensagem foi enviada!</h1>
                <p>em breve entraremos em contato via email.</p>
            </div>
            <ButtonRed buttonText="Inicio" onClick={handleClick}/>
        </div>
    )
}

export default MensagemEnviada