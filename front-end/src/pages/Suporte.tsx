import "../css/suporte.css";
import { ButtonRed } from "../components/MoreNewsButton";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { submitSupportTicket } from "../services/api";

import LogojcCentralizada from "../components/LogojcCentralizada";
import SuporteImage from "../assets/imgs/suport-image.png";
import BackArrow from "../assets/icons/backArrow.png";

const Suporte = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      alert("Você precisa estar logado para enviar um ticket de suporte.");
      return;
    }

    if (!description.trim()) {
      setError("Por favor, descreva o problema.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitSupportTicket(description);
      navigate("/perfil/suporte/mensagem-enviada");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao enviar o ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suport-container">
      <LogojcCentralizada />
      <i onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
        <img src={BackArrow} alt="Voltar" />
      </i>
      <img src={SuporteImage} alt="Imagem do suporte" />
      <h1>Descrição do problema</h1>
      <textarea
        name="texto-para-suporte"
        id="suportTextArea"
        placeholder="Escreva aqui..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      ></textarea>
      {error && <p className="error-message">{error}</p>}
      <ButtonRed
        buttonText={loading ? "Enviando..." : "Enviar"}
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
};

export default Suporte;
