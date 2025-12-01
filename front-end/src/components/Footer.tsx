import "../css/footer.css";
import { DividerTopicGrey } from "./Topic";

import LogoJCPM from "../assets/imgs/JPCM-logo.png";

const Footer = () => {
  return (
    <>
      <div className="primary-footer">
        <DividerTopicGrey topicTitle="Canais" />
        <p>Últimas Notícias</p>
        <p>Colunas</p>
        <p>Opinião</p>
      </div>
      <div className="primary-footer">
        <DividerTopicGrey topicTitle="Institucional" />
        <p>Quem somos</p>
        <p>Praticas ASG</p>
        <p>JCPM</p>
        <p>Privacidade</p>
        <p>Melhores Praticas</p>
        <p>LGPD</p>
        <p>Publicações</p>
        <p>Expediente</p>
        <p>Fale conosco</p>
        <p>Trabalhe conosco</p>
      </div>
      <div className="primary-footer">
        <DividerTopicGrey topicTitle="Serviços" />
        <p>Notícias pelo Whatsapp</p>
        <p>Newsletter JC</p>
        <p>Publicidade Leal</p>
        <p>Anuncie conosco</p>
      </div>
      <div className="secundary-footer">
        <img src={LogoJCPM} alt="Logo JCPM" />
        <div>
          <p>jornal @ 2025 - Uma empresa do grupo JCPM</p>
          <p>
            PARA SOLICITAÇÃO DE LICENCIAMENTO CONTACTAR EDITORES@NE10.COM.BR
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
