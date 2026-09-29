import { useEffect, useState } from 'react';
import { getArtisans } from '../services/api.js';
import CarteArtisan from '../composants/CarteArtisan.jsx';
import { useSearchParams } from 'react-router-dom';

function Recherche() {
  const [parametres] = useSearchParams();
  const q = parametres.get('q') ?? '';

  const [donnees, setDonnees] = useState({
    requete: null,
    artisans: [],
    erreur: null,
  });

  useEffect(() => {
    let annule = false;

    getArtisans({ recherche: q })
      .then((artisans) => {
        if (!annule) setDonnees({ requete: q, artisans, erreur: null });
      })
      .catch((e) => {
        if (!annule)
          setDonnees({ requete: q, artisans: [], erreur: e.message });
      });

    return () => {
      annule = true;
    };
  }, [q]);

  const chargement = donnees.requete !== q;
  const { artisans, erreur } = donnees;

  return (
    <section className="liste">
      <div className="container">
        <h1>{q ? `Résultats pour « ${q} »` : 'Tous les artisans'}</h1>
        {chargement && <p>Chargement…</p>}
        {erreur && <p className="text-danger">{erreur}</p>}

        {!chargement && !erreur && (
          <>
            <p className="compteur">
              {artisans.length} artisan{artisans.length > 1 ? 's' : ''} trouvé
              {artisans.length > 1 ? 's' : ''}
            </p>

            {artisans.length === 0 && (
              <p>Aucun artisan ne correspond à cette recherche.</p>
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
  );
}

export default Recherche;
