import { useEffect, useState } from "react";

function App() {
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello/")
      .then(res => res.json())
      .then(data => setMensagem(data.mensagem))
      .catch(err => console.error("Erro ao buscar API:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Front React + Django API</h1>
      <p>Mensagem da API:</p>
      <h2>{mensagem}</h2>
    </div>
  );
}

export default App;