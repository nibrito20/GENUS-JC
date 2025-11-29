import { useEffect, useState } from "react";

export function useGamificacao() {
  const [sequencia, setSequencia] = useState(0);
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/gamificacao/", {
      credentials: "include" // importante para sessão/cookies
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar gamificação");
        return res.json();
      })
      .then(data => {
        setSequencia(data.sequencia);
        setDiasRestantes(data.dias_restantes);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return { sequencia, diasRestantes, loading };
}
