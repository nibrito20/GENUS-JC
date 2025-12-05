import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "../components/Container";

import "../css/registro.css";

import LogoJC from "../assets/imgs/Logo JC.png";
import BackArrow from "../assets/icons/backArrow.png";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [erro, setErro] = useState("");

  const handleRegister = async () => {
    setErro("");

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, password2 }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErro(data.error);
      return;
    }

    navigate("/login");
  };

  return (
    <Container>
      <div className="register-card">
        <div className="head">
          <img src={BackArrow} alt="voltar" onClick={() => navigate(-1)} />
          <Link to="/">
            <img src={LogoJC} alt="Logo JC" />
          </Link>
        </div>

        <h1>Registrar-se</h1>

        {erro && <p className="erro">{erro}</p>}

        <section className="input-section">
          <div>
            <p>Usuario</p>
            <input
              type="text"
              placeholder="Digite seu usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <p>Senha</p>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <p>Confirmar senha</p>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
        </section>

        <section className="registrar">
          <button onClick={handleRegister}>Registrar</button>
        </section>
      </div>
    </Container>
  );
}
