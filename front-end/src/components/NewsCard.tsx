import "../css/newscard.css";
import Topic from "./Topic";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { adicionarFavorito, removerFavorito } from "../services/api";

type newsCardProps = {
  newsTitle: string;
  newsImg: string;
  topicLink: string;
  noticia_id?: number;
  isFavorito?: boolean;
  onFavoritoChange?: (isFavorito: boolean) => void;
  newsTopic: {
    topicTitle: string;
  };
};

const NewsCard = ({
  newsTitle,
  newsImg,
  newsTopic,
  topicLink,
  noticia_id,
  isFavorito = false,
  onFavoritoChange,
}: newsCardProps) => {
  const { user } = useContext(AuthContext);
  const [favorito, setFavorito] = useState(isFavorito);

  const handleFavoritoToggle = async (e: React.MouseEvent) => {
    // Evita que o clique no botão dispare o Link pai
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Faça login para adicionar aos favoritos");
      return;
    }

    if (!noticia_id) return;

    try {
      if (favorito) {
        await removerFavorito(noticia_id);
        setFavorito(false);
        onFavoritoChange?.(false);
      } else {
        await adicionarFavorito(noticia_id);
        setFavorito(true);
        onFavoritoChange?.(true);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
      alert("Erro ao atualizar favorito");
    }
  };

  return (
    <Link to={topicLink} className="news-card-link">
      <div className="news-card-container">
        <div className="news-card-image-wrapper">
          {newsImg ? (
            <img src={newsImg} alt={newsTitle} />
          ) : (
            <div className="news-placeholder">Sem imagem</div>
          )}
        </div>
        <Topic 
          topicTitle={newsTopic.topicTitle}
          showStar={true}
          isFavorito={favorito}
          onStarClick={handleFavoritoToggle}
        />
        <div className="news-card-title">{newsTitle}</div>
      </div>
    </Link>
  );
};

export default NewsCard;

