import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Container from "../components/Container";

import "../css/registro.css";

import LogoJC from "../assets/imgs/Logo JC.png";
import BackArrow from "../assets/icons/backArrow.png";

export default function register() {
  const navigate = useNavigate();

  const voltar = () => {
    navigate(-1);
  };
  return (
    <Container>
      <div className="register-card">
        <div className="head">
          <img src={BackArrow} alt="voltar" onClick={voltar} />
          <Link to="/"><img src={LogoJC} alt="Logo JC" /></Link>
        </div>
        <h1>Registrar-se</h1>
        <section className="input-section">
          <div>
            <p>Email</p>
            <input type="text" name="" id="" placeholder="Digite seu email"/>
          </div>
          <div>
            <p>Senha</p>
            <input type="password" placeholder="Digite sua senha"/>
          </div>
          <div>
            <p>Confirmar senha</p>
            <input type="password" placeholder="Digite sua senha"/>
          </div>
        </section>
        <section className="registrar">
          <button>Entrar</button>
        </section>
      </div>
    </Container>
  );
}