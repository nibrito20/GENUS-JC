import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Container from "../components/Container";
import "../css/login.css";

import LogoJC from "../assets/imgs/Logo JC.png";
import BackArrow from "../assets/icons/backArrow.png";

import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // pegando função login do contexto

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const voltar = () => navigate(-1);

  const fazerLogin = async () => {
    setErro(""); // limpar erro

    try {
      const resposta = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // MUITO IMPORTANTE
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (resposta.ok) {
        const dados = await resposta.json();

        // Atualiza o contexto com o usuário logado
        // Aqui você pode usar o nome do usuário ou o email, dependendo da sua API
        login(dados.username || email); 

        navigate("/"); // redireciona para home
      } else {
        const dados = await resposta.json();
        setErro(dados.error || "Credenciais inválidas.");
      }
    } catch (err) {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <Container>
      <div className="login-card">
        <div className="header">
          <img src={BackArrow} alt="voltar" onClick={voltar} />
          <Link to="/"><img src={LogoJC} alt="Logo JC" /></Link>
        </div>

        <h1>Entrar</h1>

        {erro && <p className="erro">{erro}</p>}

        <section className="inputs-section">
          <div>
            <p>Email</p>
            <input 
              type="text" 
              placeholder="Digite seu email"
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
        </section>

        <section className="logar">
          <button onClick={fazerLogin}>Entrar</button>
          <Link to="/registro">Não tenho uma conta</Link>
        </section>
      </div>
    </Container>
  );
}
