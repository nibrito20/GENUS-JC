import { useCallback } from "react";
import "../css/ouvirnoticiabutton.css";

const TextToSpeech = () => {
  const handleSpeak = useCallback(() => {
    const element = document.getElementById("texto-noticia");

    if (!element) {
      console.warn("Elemento com id 'texto-noticia' não encontrado.");
      return;
    }

    const text = element.innerText.trim();
    if (!text) {
      console.warn("Nenhum texto encontrado para leitura.");
      return;
    }

    // Verifica se a API existe
    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis não é suportado por este navegador.");
      return;
    }

    const synth = window.speechSynthesis;

    const doSpeak = () => {
      // cria a utterance somente na hora de falar (após carregar vozes)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";

      // tenta escolher uma voz pt-BR
      const voices = synth.getVoices();
      const brVoice = voices.find((v) =>
        v.lang.toLowerCase().includes("pt-br")
      );
      if (brVoice) {
        utterance.voice = brVoice;
      }

      // evita sobreposição e inicia a fala
      synth.cancel();
      synth.speak(utterance);
    };

    // se as vozes já estiverem carregadas, fala imediatamente
    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      doSpeak();
      return;
    }

    // caso contrário, aguarda o evento 'voiceschanged' (vai rodar só uma vez)
    const onVoicesChanged = () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      doSpeak();
    };

    synth.addEventListener("voiceschanged", onVoicesChanged);

    // por segurança, tenta disparar uma chamada a getVoices() que alguns browsers usam para iniciar o carregamento
    synth.getVoices();
  }, []);

  return (
    <div className="speak-button-all-container">
      <div className="speak-button-container">
        <h1>Clique aqui e escute a matéria</h1>
        <button onClick={handleSpeak} className="speak-button">
          ▶
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;