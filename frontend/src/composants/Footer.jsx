import { Link } from 'react-router-dom';

const LIENS_LEGAUX = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/donnees-personnelles', label: 'Données personnelles' },
  { to: '/accessibilite', label: 'Accessibilité' },
  { to: '/cookies', label: 'Cookies' },
];

function Footer({ categories }) {
  return (
    <footer className="pied">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="h6">Nous contacter</h2>
            <address>
              101 cours Charlemagne
              <br />
              CS 20033
              <br />
              69269 LYON CEDEX 02
              <br />
              France
            </address>
            <a href="tel:+33426734000">+33 (0)4 26 73 40 00</a>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="h6">Informations</h2>
            <nav aria-label="Informations">
              <ul className="list-unstyled">
                {LIENS_LEGAUX.map((lien) => (
                  <li key={lien.to}>
                    <Link to={lien.to}>{lien.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="h6">Les catégories</h2>
            <nav aria-label="Les catégories">
              <ul className="list-unstyled">
                {categories.map((categorie) => (
                  <li key={categorie.id}>
                    <Link to={`/categorie/${categorie.id}`}>
                      {categorie.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <p className="copyright">© 2026 Région Auvergne-Rhône-Alpes</p>
      </div>
    </footer>
  );
}

export default Footer;
