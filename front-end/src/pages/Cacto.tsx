import { useNavigate } from "react-router-dom";
import { useGamificacao } from "../hooks/useGamificacao";

import "../css/Cacto.css";

import { Navbar2 } from "../components/Navbar";

import BackArrow from "../assets/icons/backArrow.png";
import Cacto1 from "../assets/imgs/cacto1.png";
import Cacto2 from "../assets/imgs/cacto2.png";
import Cacto3 from "../assets/imgs/cacto3.png";
import Cacto4 from "../assets/imgs/cacto4.png";
import Cacto5 from "../assets/imgs/cacto5.png";
import Cacto6 from "../assets/imgs/cacto6.png";

export default function Cacto() {
  const { sequencia, diasRestantes, loading } = useGamificacao();
  const navigate = useNavigate();

  const voltar = () => navigate(-1);
  let cactoImg;

  if (sequencia <= 7) {
    cactoImg = Cacto1;
  } else if (sequencia <= 14) {
    cactoImg = Cacto2;
  } else if (sequencia <= 21) {
    cactoImg = Cacto3;
  } else if (sequencia <= 28) {
    cactoImg = Cacto4;
  } else if (sequencia <= 35) {
    cactoImg = Cacto5;
  } else {
    cactoImg = Cacto6;
  }

  return (
    <>
      <Navbar2 />
      <div className="container-cacto">
        <img
          src={BackArrow}
          alt="voltar"
          onClick={voltar}
          className="arrowback"
        />
        <img src={cactoImg} alt="Cacto" className="cacto-representation" />
        <h1 className="h1-margin">Cacto</h1>

        <section className="cacto-statistics">
          {!loading && (
            <>
              <h2 className="h2-adjust">Dias consecutivos</h2>
              <p className="margin-adjust">{sequencia}</p>
              <div className="hr margin-adjust"></div>

              <h2 className="h2-adjust">Dias para o Próximo visual</h2>
              <p className="margin-adjust">{diasRestantes}</p>
              <div className="hr margin-adjust"></div>
            </>
          )}

          <h2 className="h2-adjust"></h2>
          <p className="pc-adjust margin-adjust">
            Para acumular dias você deve ler notícias diariamente, se não você
            perde todos os dias lidos
          </p>
          <div className="hr margin-adjust"></div>
        </section>
      </div>
    </>
  );
}
