import { useCallback, useState } from "react";
import "../css/ouvirnoticiabutton.css";

const TextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    const synth = window.speechSynthesis;

    // Se já está falando → parar tudo
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

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

    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis não é suportado por este navegador.");
      return;
    }

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";

      // escolhe voz PT-BR se disponível
      const voices = synth.getVoices();
      const brVoice = voices.find((v) =>
        v.lang.toLowerCase().includes("pt-br")
      );
      if (brVoice) {
        utterance.voice = brVoice;
      }

      // quando terminar de falar → resetar botão
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      synth.cancel();
      synth.speak(utterance);
      setIsSpeaking(true);
    };

    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      doSpeak();
      return;
    }

    const onVoicesChanged = () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      doSpeak();
    };

    synth.addEventListener("voiceschanged", onVoicesChanged);
    synth.getVoices();
  }, [isSpeaking]);

  return (
    <div className="speak-button-all-container">
      <div className="speak-button-container">
        <h1>Clique aqui e escute a matéria</h1>
        <button onClick={handleSpeak} className="speak-button">
          {isSpeaking ? "⏸" : "▶"}
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;