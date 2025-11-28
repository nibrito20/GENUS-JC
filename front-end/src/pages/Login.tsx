import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Container from "../components/Container";

import "../css/login.css";

import LogoJC from "../assets/imgs/Logo JC.png";
import BackArrow from "../assets/icons/backArrow.png";

export default function Login() {
  const navigate = useNavigate();

  const voltar = () => {
    navigate(-1);
  };
  return (
    <Container>
      <div className="login-card">
        <div className="header">
          <img src={BackArrow} alt="voltar" onClick={voltar} />
          <Link to="/"><img src={LogoJC} alt="Logo JC" /></Link>
        </div>
        <h1>Entrar</h1>
        <section className="inputs-section">
          <div>
            <p>Email</p>
            <input type="text" name="" id="" placeholder="Digite seu email"/>
          </div>
          <div>
            <p>Senha</p>
            <input type="password" placeholder="Digite sua senha"/>
          </div>
        </section>
        <section className="logar">
          <button>Entrar</button>
          <Link to="/registro">Não tenho uma conta</Link>
        </section>
      </div>
    </Container>
  );
}
