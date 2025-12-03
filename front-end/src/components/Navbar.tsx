import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LogoUOL from "../assets/imgs/Logo UOL.png";
import LogoJC from "../assets/imgs/Logo JC.png";
import HamburguerIcon from "../assets/icons/Hambúrguer.png";
import SearchIcon from "../assets/icons/search.png";
import noUserIcon from "../assets/icons/noUser.png";
import Cacto from "../assets/icons/Cacto.png";
import ArrowUp from "../assets/icons/arrow_up.png";

import facebookIcon from "../assets/icons/facebook-icon.png"
import instagramIcon from "../assets/icons/instagram-icon.png"
import xIcon from "../assets/icons/x-icon.png"
import linkedinIcon from "../assets/icons/linkedin-icon.png"
import youtubeIcon from "../assets/icons/youtube-icon.png"

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriasOpen, setCategoriasOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const toggleCategorias = () => setCategoriasOpen(!categoriasOpen);

  // Popular suggestions - tópicos/categorias frequentes
  const frequentSearches = [
    "Política",
    "Economia",
    "Saúde",
    "Educação",
    "Segurança",
    "Mundo",
    "Blog do torcedor",
  ];

  function handleSearchInput(value: string) {
    setSearchQuery(value);
    if (value.trim()) {
      // Filter suggestions based on input
      const filtered = frequentSearches.filter(term =>
        term.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }

  function selectSuggestion(suggestion: string) {
    navigate(`/noticias?q=${encodeURIComponent(suggestion)}`);
    setSearchQuery("");
    setSearchSuggestions([]);
    closeSearch();
  }

  function doSearch() {
    const q = (searchQuery || "").trim();
    if (!q) return;
    // navega para a página de notícias com query
    navigate(`/noticias?q=${encodeURIComponent(q)}`);
    closeSearch();
  }

  return (
    <div>
      {/* Menu lateral */}
      <div
        className={`sidebar-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <aside
          className={`sidebar ${menuOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <button className="close-btn" onClick={closeMenu}>
              X
            </button>
            <ul className="main-menu-list">
              <li>
                <div className="categorias" onClick={toggleCategorias}>
                  <h1>Categorias</h1>
                  <img
                    src={ArrowUp}
                    alt="Arrow"
                    className={categoriasOpen ? "rotated" : ""}
                  />
                </div>
                <ul
                  className={`secundary-menu-list ${
                    categoriasOpen ? "open" : ""
                  }`}
                >
                  <li>
                    <Link to="/noticias?section=recentes" onClick={closeMenu}>Recentes</Link>
                  </li>
                  <li>
                    <Link to="/noticias?section=para-voce" onClick={closeMenu}>Para você</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Pernambuco" onClick={closeMenu}>Pernambuco</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Mundo" onClick={closeMenu}>Mundo</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Política" onClick={closeMenu}>Política</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Economia" onClick={closeMenu}>Economia</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Blog%20do%20torcedor" onClick={closeMenu}>Blog do torcedor</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Social" onClick={closeMenu}>Social</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Saúde%20e%20Bem-Estar" onClick={closeMenu}>Saúde e Bem-Estar</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Educação" onClick={closeMenu}>Educação</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Cultura" onClick={closeMenu}>Cultura</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Opinião" onClick={closeMenu}>Opinião</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Mobilidade" onClick={closeMenu}>Mobilidade</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Segurança" onClick={closeMenu}>Segurança</Link>
                  </li>
                  <li>
                    <Link to="/noticias?genero=Recall%20de%20Marcas" onClick={closeMenu}>Recall de Marcas</Link>
                  </li>
                </ul>
              </li>
              <li>
                <h1>Anuncie no JC</h1>
              </li>
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

      {/* Navbar principal */}
      <header>
        <nav className="Uol-nav">
          <img src={LogoUOL} alt="Logo UOL" />
        </nav>

        <nav className="Jc-nav">
          <Link to="/">
            <img src={LogoJC} alt="Logo JC" className="Jc-image" />
          </Link>
          <div>
            <button className="navbutton" onClick={openSearch}>
              <img src={SearchIcon} alt="Buscar" />
            </button>
            <button className="navbutton" onClick={openMenu}>
              <img src={HamburguerIcon} alt="Menu" />
            </button>

            {/* Conteúdo baseado no login */}
            {user ? (
              <>
                <Link to="/cacto" className="navlink">
                  <img src={Cacto} alt="Cacto" className="cacto" />
                </Link>
                <Link to="/perfil" className="navlink">
                  <img src={noUserIcon} alt="Perfil" className="redondo" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="navlink">
                  <img src={noUserIcon} alt="Login" className="redondo" />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Barra de pesquisa */}
      <div
        className={`search-overlay ${searchOpen ? "open" : ""}`}
        onClick={closeSearch}
      >
        <div
          className={`search-bar ${searchOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="search-input">
            <img src={SearchIcon} alt="" />
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSearch();
              }}
            />
            <button onClick={doSearch} className="search-submit">
              <img src={SearchIcon} alt="Buscar" />
            </button>
            {searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="suggestion-item"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

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