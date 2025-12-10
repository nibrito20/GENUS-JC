import { useState } from "react";
import "../css/feedback.css";
import { Navbar2 } from "../components/Navbar";

import Interrogation from "../assets/icons/interrogation-feedback.png";

const Feedback = () => {
  const [estrelas, setEstrelas] = useState(0);
  const [detalhes, setDetalhes] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    setLoading(true);

    const response = await fetch("http://localhost:8000/api/feedback/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        estrelas: estrelas.toString(),
        detalhes: detalhes,
      }).toString(),
    });

    const result = await response.json();
    setLoading(false);

    if (result.success) {
      alert("Feedback enviado!");
      setEstrelas(0);
      setDetalhes("");
    } else {
      alert("Erro ao enviar feedback.");
    }
  };

  return (
    <>
      <Navbar2/>
      <div className="all-feedback-container">
        <div className="feedback-container">
          <img
            src={Interrogation}
            alt="Interrogação"
            className="interrogation-img"
          />
          <h1 className="feedback-title">gostou da experiencia com o Jc?</h1>

          {/* Estrelas */}
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`star ${n <= estrelas ? "selected" : ""}`}
                onClick={() => setEstrelas(n)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Comentário */}
          <textarea
            className="feedback-textarea"
            placeholder="Escreva aqui"
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
          />

          <button
            className="feedback-button"
            onClick={enviar}
            disabled={loading || estrelas === 0 || detalhes.trim() === ""}
          >
            {loading ? "Enviando..." : "Enviar Feedback"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
