import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useGamificacao } from "../hooks/useGamificacao";

import LogoUOL from "../assets/imgs/Logo UOL.png";
import LogoJC from "../assets/imgs/Logo JC.png";
import HamburguerIcon from "../assets/icons/Hamburguer.png";
import SearchIcon from "../assets/icons/search.png";
import noUserIcon from "../assets/icons/noUser.png";
import ArrowUp from "../assets/icons/arrow_up.png";

import facebookIcon from "../assets/icons/facebook-icon.png";
import instagramIcon from "../assets/icons/instagram-icon.png";
import xIcon from "../assets/icons/x-icon.png";
import linkedinIcon from "../assets/icons/linkedin-icon.png";
import youtubeIcon from "../assets/icons/youtube-icon.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSugestoes, setSearchSugestoes] = useState<{ id: number; slug: string; titulo: string }[]>([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchSugestoes([]);
  };

  const toggleCategorias = () => setCategoriasOpen((prev) => !prev);

  async function handleSearchInput(value: string) {
    setSearchQuery(value);

    if (value.trim().length < 2) {
      setSearchSugestoes([]);
      return;
    }

    setLoadingSugestoes(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search-sugestoes/?q=${encodeURIComponent(value)}`,
        { credentials: "include" }
      );

      const data = await response.json();
      if (data?.sugestoes && Array.isArray(data.sugestoes)) {
        setSearchSugestoes(data.sugestoes);
      } else {
        setSearchSugestoes([]);
      }
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
      setSearchSugestoes([]);
    }
    setLoadingSugestoes(false);
  }

  function doSearch(query?: string) {
    const q = (query || searchQuery || "").trim();
    if (!q) return;

    navigate(`/noticias?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setSearchSugestoes([]);
    closeSearch();
  }

  function handleSugestaoClick(slug: string) {
    navigate(`/noticia/${slug}`);
    setSearchQuery("");
    setSearchSugestoes([]);
    closeSearch();
  }

  const { cactoImg} = useGamificacao();

  return (
    <div>
      {/* Sidebar */}
      <div className={`sidebar-overlay ${menuOpen ? "open" : ""}`} onClick={closeMenu}>
        <aside className={`sidebar ${menuOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
          <div>
            <button className="close-btn" onClick={closeMenu}>X</button>

            <ul className="main-menu-list">
              <li>
                <div className="categorias" onClick={toggleCategorias}>
                  <h1>Categorias</h1>
                  <img src={ArrowUp} alt="Arrow" className={categoriasOpen ? "rotated" : ""} />
                </div>

                <ul className={`secundary-menu-list ${categoriasOpen ? "open" : ""}`}>
                  <li><Link to="/noticias?section=recentes" onClick={closeMenu}>Recentes</Link></li>
                  <li><Link to="/noticias?section=para-voce" onClick={closeMenu}>Para você</Link></li>
                  <li><Link to="/noticias?genero=Pernambuco" onClick={closeMenu}>Pernambuco</Link></li>
                  <li><Link to="/noticias?genero=Mundo" onClick={closeMenu}>Mundo</Link></li>
                  <li><Link to="/noticias?genero=Política" onClick={closeMenu}>Política</Link></li>
                  <li><Link to="/noticias?genero=Economia" onClick={closeMenu}>Economia</Link></li>
                  <li><Link to="/noticias?genero=Blog%20do%20torcedor" onClick={closeMenu}>Blog do torcedor</Link></li>
                  <li><Link to="/noticias?genero=Social" onClick={closeMenu}>Social</Link></li>
                  <li><Link to="/noticias?genero=Saúde%20e%20Bem-Estar" onClick={closeMenu}>Saúde e Bem-Estar</Link></li>
                  <li><Link to="/noticias?genero=Educação" onClick={closeMenu}>Educação</Link></li>
                  <li><Link to="/noticias?genero=Cultura" onClick={closeMenu}>Cultura</Link></li>
                  <li><Link to="/noticias?genero=Opinião" onClick={closeMenu}>Opinião</Link></li>
                  <li><Link to="/noticias?genero=Mobilidade" onClick={closeMenu}>Mobilidade</Link></li>
                  <li><Link to="/noticias?genero=Segurança" onClick={closeMenu}>Segurança</Link></li>
                  <li><Link to="/noticias?genero=Recall%20de%20Marcas" onClick={closeMenu}>Recall de Marcas</Link></li>
                </ul>
              </li>

              <li><h1>Anuncie no JC</h1></li>
              <li><Link to="/feedback" className="link-to-feedback"><h1>Avalie o JC</h1></Link></li>
            </ul>
          </div>

          <div className="aside-footer">
            <h1>Siga o JC</h1>
            <div className="net-icons">
              <img src={facebookIcon} alt="Facebook" />
              <img src={instagramIcon} alt="Instagram" />
              <img src={xIcon} alt="X" />
              <img src={linkedinIcon} alt="Linkedin" />
              <img src={youtubeIcon} alt="Youtube" />
            </div>
          </div>
        </aside>
      </div>

      {/* Navbar Principal */}
      <header>
        <nav className="Uol-nav">
          <img src={LogoUOL} alt="Logo UOL" />
        </nav>

        <nav className="Jc-nav">
          <Link to="/">
            <img src={LogoJC} alt="Logo JC" className="Jc-image" />
          </Link>

          <div>
            <button className="navbutton" onClick={searchOpen ? closeSearch : openSearch}>
              <img src={SearchIcon} alt="Buscar" />
            </button>
            <button className="navbutton" onClick={openMenu}>
              <img src={HamburguerIcon} alt="Menu" />
            </button>

            {user ? (
              <>
                <Link to="/cacto" className="navlink">
                  <img src={cactoImg} alt="Cacto" className="cacto" />
                </Link>
                <Link to="/perfil" className="navlink">
                  <img src={noUserIcon} alt="Perfil" className="redondo" />
                </Link>
              </>
            ) : (
              <Link to="/login" className="navlink">
                <img src={noUserIcon} alt="Login" className="redondo" />
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Barra de pesquisa */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`} onClick={closeSearch}>
        <div className={`search-bar ${searchOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
          <div className="search-input">
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              autoFocus
            />

            <button onClick={() => doSearch()} className="search-submit">
              <img src={SearchIcon} alt="Buscar" />
            </button>
          </div>

          {searchSugestoes.length > 0 && (
            <div className="search-sugestoes">
              {searchSugestoes.map((s) => (
                <div key={s.id} className="search-sugestao-item" onClick={() => handleSugestaoClick(s.slug)}>
                  <img src={SearchIcon} alt="" style={{ width: 16, height: 16, opacity: 0.6 }} />
                  <span>{s.titulo}</span>
                </div>
              ))}
            </div>
          )}

          {loadingSugestoes && <div className="loading-sugestoes">Carregando...</div>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

/* NAVBAR 2 */
const Navbar2 = () => {
  return (
    <header className="all-nav">
      <nav className="Uol-nav">
        <img src={LogoUOL} alt="Logo UOL" />
      </nav>

      <nav className="Jc-nav-2">
        <Link to="/">
          <img src={LogoJC} alt="Logo JC" className="Jc-image" />
        </Link>
      </nav>
    </header>
  );
};

export { Navbar2 };
