import "../css/comentarios.css";
import { useEffect, useState, useContext } from "react";
import { getComentariosNoticia, criarComentario, curtirComentario, type Comentario } from "../services/api";
import { AuthContext } from "../context/AuthContext";

import EnviarComentario from "../assets/icons/send-comentarios.png";
import FavoritarComentario from "../assets/icons/favorite-comentarios.png";
import ComentarioFavoritado from "../assets/icons/favorite-comentarios-favorited.png";

import UserIcon from "../assets/icons/noUser.png";

interface ComentariosProps {
  slug: string;
}

const Comentarios = ({ slug }: ComentariosProps) => {
  const { user } = useContext(AuthContext);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarComentarios();
  }, [slug]);

  async function carregarComentarios() {
    try {
      setLoading(true);
      const data = await getComentariosNoticia(slug);
      setComentarios(data.comentarios || []);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnviarComentario() {
    if (!novoComentario.trim() || enviando) return;
    
    if (!user) {
      alert("Faça login para comentar");
      return;
    }

    try {
      setEnviando(true);
      const comentario = await criarComentario(slug, novoComentario.trim());
      setComentarios([comentario, ...comentarios]);
      setNovoComentario("");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Erro ao enviar comentário. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleCurtir(comentarioId: number) {
    if (!user) {
      alert("Faça login para curtir comentários");
      return;
    }

    try {
      const comentarioAtualizado = await curtirComentario(comentarioId);
      setComentarios(comentarios.map(c => 
        c.id === comentarioId ? comentarioAtualizado : c
      ));
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  }

  function getAvatarUrl(comentario: Comentario) {
    return UserIcon;
  }

  function getUserAvatar() {
    if (user?.profile?.foto_url_display) {
      return user.profile.foto_url_display;
    }
    if (user?.profile?.foto_url) {
      return user.profile.foto_url;
    }
    return UserIcon;
  }

  function formatarData(data: string) {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <div className="comentarios-container">
      <h1>comentários</h1>
      
      {loading ? (
        <p>Carregando comentários...</p>
      ) : (
        <div className="comentarios-list">
          {comentarios.length === 0 ? (
            <p style={{ color: "#9E9E9E", textAlign: "center", padding: "20px" }}>
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          ) : (
            comentarios.map((comentario) => (
              <div key={comentario.id} className="comentario">
                <img 
                  src={getAvatarUrl(comentario)} 
                  alt="Icone do usuário" 
                  className="comentario-avatar"
                />
                <div className="comentario-content">
                  <h2 className="user-comentario">{comentario.nome_usuario || comentario.usuario}</h2>
                  <p className="conteudo-comentario">{comentario.texto}</p>
                  <span className="responder-link">responder</span>
                </div>
                <div 
                  onClick={() => handleCurtir(comentario.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img 
                    src={comentario.likes > 0 ? ComentarioFavoritado : FavoritarComentario} 
                    alt="Curtir" 
                    className="comentario-like" 
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="enviar-comentario">
        <img src={getUserAvatar()} alt="Icone do usuário" className="redondo"/>
        <input 
          type="text" 
          placeholder="Escreva aqui seu comentário..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleEnviarComentario();
            }
          }}
          disabled={enviando || !user}
        />
        <img 
          src={EnviarComentario} 
          alt="Enviar comentario" 
          className="enviar-icon"
          onClick={handleEnviarComentario}
          style={{ cursor: enviando ? "not-allowed" : "pointer", opacity: enviando ? 0.5 : 1 }}
        />
      </div>
    </div>
  );
};

export default Comentarios;
