import { Link } from 'react-router-dom';
import Etoiles from './Etoiles';
import iconeLocalisation from '../assets/icones/localisation.svg';
import iconeChevron from '../assets/icones/chevron.svg';

function CarteArtisan({ artisan }) {
  return (
    <Link to={`/artisan/${artisan.id}`} className="carte">
      <div className="contenu">
        <h3>{artisan.nom}</h3>
        <p className="specialite">{artisan.Specialite.nom}</p>
        <Etoiles note={artisan.note} />
        <p className="ville">
          <img src={iconeLocalisation} alt="" />
          {artisan.ville}
        </p>
      </div>
      <img className="chevron" src={iconeChevron} alt="" />
    </Link>
  );
}

export default CarteArtisan;
