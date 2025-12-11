import "../css/comentarios.css";

import EnviarComentario from "../assets/icons/send-comentarios.png";
import FavoritarComentario from "../assets/icons/favorite-comentarios.png";
import ComentarioFavoritado from "../assets/icons/favorite-comentarios-favorited.png";

import UserIcon from "../assets/icons/noUser.png";

const Comentarios = () => {
  return (
    <div className="comentarios-container">
      <h1>comentários</h1>
      <div className="enviar-comentario">
        <img src={UserIcon} alt="Icone do usuário" className="redondo"/>
        <input type="text" placeholder="Escreva aqui seu comentário..."/>
        <img src={EnviarComentario} alt="Enviar comentario" />
      </div>
      <div className="comentario">
        <img src={UserIcon} alt="Icone do usuário" className="redondo"/>
        <div>
          <h2 className="user-comentario">nome do usuario</h2>
          <p className="conteudo-comentario">comentario do usuario</p>
        </div>
        <img src={FavoritarComentario} alt="Curtir" />
      </div>
    </div>
  );
};

export default Comentarios;
