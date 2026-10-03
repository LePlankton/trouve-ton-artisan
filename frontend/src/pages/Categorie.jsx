import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getArtisans } from '../services/api.js';
import CarteArtisan from '../composants/CarteArtisan.jsx';
import Seo from '../composants/Seo.jsx';

function Categorie() {
  const { id } = useParams();
  const categories = useOutletContext();
  const categorie = categories.find((c) => String(c.id) === id);
  const nomCategorie = categorie?.nom ?? 'Catégorie';

  const [donnees, setDonnees] = useState({
    id: null,
    artisans: [],
    erreur: null,
  });

  useEffect(() => {
    let annule = false;

    getArtisans({ categorie: id })
      .then((artisans) => {
        if (!annule) setDonnees({ id, artisans, erreur: null });
      })
      .catch((e) => {
        if (!annule) setDonnees({ id, artisans: [], erreur: e.message });
      });

    return () => {
      annule = true;
    };
  }, [id]);

  const chargement = donnees.id !== id;
  const { artisans, erreur } = donnees;

  return (
    <>
      <Seo
        titre={`${nomCategorie} — Trouve ton artisan`}
        description={`Tous les artisans de la catégorie ${nomCategorie} en Auvergne-Rhône-Alpes : coordonnées, spécialité, ville et avis.`}
      />
      <section className="liste">
        <div className="container">
          <h1>{nomCategorie}</h1>

          {chargement && <p>Chargement…</p>}
          {erreur && <p className="text-danger">{erreur}</p>}

          {!chargement && !erreur && (
            <>
              <p className="compteur">
                {artisans.length} artisan{artisans.length > 1 ? 's' : ''} trouvé
                {artisans.length > 1 ? 's' : ''}
              </p>

              {artisans.length === 0 && (
                <p>Aucun artisan dans cette catégorie.</p>
              )}

              <div className="row g-4">
                {artisans.map((artisan) => (
                  <div className="col-12 col-md-6 col-lg-4" key={artisan.id}>
                    <CarteArtisan artisan={artisan} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Categorie;
