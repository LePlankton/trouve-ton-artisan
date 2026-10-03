import { useEffect, useState } from 'react';
import { getArtisansDuMois } from '../services/api.js';
import CarteArtisan from '../composants/CarteArtisan.jsx';
import Seo from '../composants/Seo.jsx';

const ETAPES = [
  'Choisir la catégorie d’artisanat dans le menu.',
  'Choisir un artisan.',
  'Le contacter via le formulaire de contact.',
  'Une réponse sera apportée sous 48h.',
];

function Accueil() {
  const [artisans, setArtisans] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getArtisansDuMois()
      .then(setArtisans)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  return (
    <>
      <Seo
        titre="Trouve ton artisan — Annuaire des artisans d'Auvergne-Rhône-Alpes"
        description="Trouvez rapidement un artisan près de chez vous parmi les professionnels référencés en Auvergne-Rhône-Alpes : bâtiment, services, fabrication, alimentation."
      />
      <section className="bandeau">
        <div className="container">
          <h1>Trouvez un artisan près de chez vous</h1>
          <p>L’annuaire des artisans de la Région Auvergne-Rhône-Alpes.</p>
        </div>
      </section>

      <section className="etapes">
        <div className="container">
          <h2>Comment trouver mon artisan ?</h2>
          <ol className="list-unstyled">
            {ETAPES.map((texte, index) => (
              <li key={texte}>
                <span className="pastille">{index + 1}</span>
                {texte}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="artisans">
        <div className="container">
          <h2>Nos artisans du mois</h2>

          {chargement && <p>Chargement…</p>}
          {erreur && <p className="text-danger">{erreur}</p>}

          <div className="row g-4">
            {artisans.map((artisan) => (
              <div className="col-12 col-md-6 col-lg-4" key={artisan.id}>
                <CarteArtisan artisan={artisan} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Accueil;
