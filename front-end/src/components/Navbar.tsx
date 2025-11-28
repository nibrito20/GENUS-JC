import "../css/navbar.css";

import { useAuthStatus } from "../hooks/useAuthStatus";
import { Link } from "react-router-dom";
import { useState } from "react";

import LogoUOL from "../assets/imgs/Logo UOL.png";
import LogoJC from "../assets/imgs/Logo JC.png";
import HamburguerIcon from "../assets/icons/Hambúrguer.png";
import SearchIcon from "../assets/icons/search.png";
import noUserIcon from "../assets/icons/noUser.png";
import Cacto from "../assets/icons/Cacto.png";
import ArrowUp from "../assets/icons/arrow_up.png";

const Navbar = () => {
  const auth = useAuthStatus();
  const [menuOpen, MenuOpen] = useState(false);

  const [searchOpen, SearchOpen] = useState(false);

  const [categoriasOpen, setCategoriasOpen] = useState(false);

  if (auth === null) return null;

  const openMenu = () => MenuOpen(true);
  const closeMenu = () => MenuOpen(false);

  const openSearch = () => SearchOpen(true);
  const closeSearch = () => SearchOpen(false);

  const toggleCategorias = () => setCategoriasOpen(!categoriasOpen);

  return (
    <>
      <div
        className={`sidebar-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <aside
          className={`sidebar ${menuOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={closeMenu}>
            X
          </button>
          <ul className="main-menu-list">
            <li>
              <div className="categorias" onClick={toggleCategorias}>
                <h1>Categorias</h1>
                <img src={ArrowUp} alt="Arrow" className={categoriasOpen ? "rotated" : ""}/>
              </div>
              <ul className={`secundary-menu-list ${categoriasOpen ? "open" : ""}`}>
                <li><Link to={"/"}>Recentes</Link></li>
                <li><Link to={"/"}>Para você</Link></li>
                <li><Link to={"/"}>Pernambuco</Link></li>
                <li><Link to={"/"}>Mundo</Link></li>
                <li><Link to={"/"}>Política</Link></li>
                <li><Link to={"/"}>Economia</Link></li>
                <li><Link to={"/"}>Blog do torcedor</Link></li>
                <li><Link to={"/"}>Social</Link></li>
                <li><Link to={"/"}>Saúde e Bem-Estar</Link></li>
                <li><Link to={"/"}>Educação</Link></li>
                <li><Link to={"/"}>Cultura</Link></li>
                <li><Link to={"/"}>Opinião</Link></li>
                <li><Link to={"/"}>Mobilidade</Link></li>
                <li><Link to={"/"}>Segurança</Link></li>
                <li><Link to={"/"}>Recall de Marcas</Link></li>
              </ul>
            </li>
            <li>
              <h1>Anuncie no JC</h1>
            </li>
          </ul>
        </aside>
      </div>

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
            {auth ? (
              <>
                <Link to="">
                  <img src={Cacto} alt="Cacto" />
                </Link>
                <Link to="/perfil">
                  <img src={noUserIcon} alt="Perfil" />
                </Link>
              </>
            ) : (
              <Link to="/login" className="navlink">
                <img src={noUserIcon} alt="Login" />
              </Link>
            )}
          </div>
        </nav>
      </header>

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
            <input type="text" placeholder="Pesquisar" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
