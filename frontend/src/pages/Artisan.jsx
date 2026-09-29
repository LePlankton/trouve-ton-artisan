import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArtisan } from '../services/api.js';
import Etoiles from '../composants/Etoiles.jsx';
import photoAtelier from '../assets/photo-atelier.jpg';
import FormulaireContact from '../composants/FormulaireContact.jsx';
import iconeLocalisation from '../assets/icones/localisation.svg';

function Artisan() {
  const { id } = useParams();
  const [donnees, setDonnees] = useState({
    id: null,
    artisan: null,
    erreur: null,
  });

  useEffect(() => {
    let annule = false;

    getArtisan(id)
      .then((artisan) => {
        if (!annule) setDonnees({ id, artisan, erreur: null });
      })
      .catch((e) => {
        if (!annule) setDonnees({ id, artisan: null, erreur: e.message });
      });

    return () => {
      annule = true;
    };
  }, [id]);

  const chargement = donnees.id !== id;
  const { artisan, erreur } = donnees;

  if (chargement) return <p className="container">Chargement…</p>;
  if (erreur) return <p className="container text-danger">{erreur}</p>;

  return (
    <article className="fiche">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <img className="banniere" src={photoAtelier} alt="" />
            <h1>{artisan.nom}</h1>
            <Etoiles note={artisan.note} />
            <p className="specialite">{artisan.Specialite.nom}</p>
            <p className="ville">
              <img src={iconeLocalisation} alt="" />
              {artisan.ville}
            </p>

            <h2>À propos</h2>
            <p>{artisan.a_propos}</p>

            {artisan.site_web && (
              <a
                className="btn btn-outline-primary"
                href={artisan.site_web}
                target="_blank"
                rel="noreferrer"
              >
                Visiter le site web
              </a>
            )}
          </div>

          <div className="col-12 col-lg-5">
            <FormulaireContact artisan={artisan} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default Artisan;
