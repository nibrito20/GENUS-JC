import { useState } from "react";
import "./feedback.css"; // importa o CSS

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
    <div className="feedback-container">
      <h2 className="feedback-title">Avalie nosso site</h2>

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
        placeholder="Digite seu comentário..."
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
  );
};

export default Feedback;
