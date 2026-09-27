import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoComplet from '../assets/Logo-complet.png';
import logoReduit from '../assets/Logo-reduit.png';
import iconeLoupe from '../assets/icones/loupe.svg';
import iconeBurger from '../assets/icones/burger.svg';
import iconeFermer from '../assets/icones/fermer.svg';

function Header({ categories }) {
  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState('');
  const naviguer = useNavigate();

  function soumettre(evenement) {
    evenement.preventDefault();
    naviguer(`/recherche?q=${encodeURIComponent(recherche)}`);
  }

  return (
    <header className="entete">
      <div className="container">
        <Link to="/">
          <img
            className="logo"
            src={logoReduit}
            alt="Trouve ton artisan, retour à l'accueil"
          />
          <img
            className="logo-desktop"
            src={logoComplet}
            alt=""
            aria-hidden="true"
          />
        </Link>

        <button
          type="button"
          className="burger"
          aria-expanded={ouvert}
          aria-controls="menu-principal"
          onClick={() => setOuvert(!ouvert)}
        >
          <img src={ouvert ? iconeFermer : iconeBurger} alt="" />
          <span className="visually-hidden">
            {ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          </span>
        </button>

        <nav
          id="menu-principal"
          aria-label="Catégories"
          className={ouvert ? 'menu menu--ouvert' : 'menu'}
        >
          <ul className="list-unstyled">
            {categories.map((categorie) => (
              <li key={categorie.id}>
                <NavLink
                  to={`/categorie/${categorie.id}`}
                  onClick={() => setOuvert(false)}
                >
                  {categorie.nom}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <form role="search" className="recherche" onSubmit={soumettre}>
          <img className="icone" src={iconeLoupe} alt="" />
          <label htmlFor="recherche" className="visually-hidden">
            Rechercher un artisan
          </label>
          <input
            id="recherche"
            type="search"
            placeholder="Rechercher un artisan"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <button type="submit" className="visually-hidden">
            Rechercher
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
