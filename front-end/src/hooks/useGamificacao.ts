import { useEffect, useState } from "react";

import Cacto1 from "../assets/imgs/cacto1.png";
import Cacto2 from "../assets/imgs/cacto2.png";
import Cacto3 from "../assets/imgs/cacto3.png";
import Cacto4 from "../assets/imgs/cacto4.png";
import Cacto5 from "../assets/imgs/cacto5.png";
import Cacto6 from "../assets/imgs/cacto6.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useGamificacao() {
  const [sequencia, setSequencia] = useState(0);
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gamificacao/`, {
      credentials: "include",
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

  const cactos = [Cacto1, Cacto2, Cacto3, Cacto4, Cacto5, Cacto6];
  const cactoImg = cactos[Math.min(Math.floor(sequencia / 7), cactos.length - 1)];

  return { sequencia, diasRestantes, loading, cactoImg };
}