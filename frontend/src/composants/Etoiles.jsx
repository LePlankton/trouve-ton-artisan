import etoilesFond from '../assets/icones/etoiles-fond.svg';
import etoilesRemplies from '../assets/icones/etoiles-remplies.svg';

function Etoiles({ note }) {
  const pourcentage = (note / 5) * 100;

  return (
    <div className="note">
      <div className="etoiles" role="img" aria-label={`Noté ${note} sur 5`}>
        <img className="fond" src={etoilesFond} alt="" />
        <span className="remplies" style={{ width: `${pourcentage}%` }}>
          <img src={etoilesRemplies} alt="" />
        </span>
      </div>
      <p className="valeur">{note.toLocaleString('fr-FR')} / 5</p>
    </div>
  );
}

export default Etoiles;
