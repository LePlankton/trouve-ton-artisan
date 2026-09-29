import { Link } from 'react-router-dom';
import illustration from '../assets/illustration-404.svg';

function NonTrouvee() {
  return (
    <section className="erreur-404">
      <div className="container">
        <img src={illustration} alt="" />
        <h1>Page non trouvée</h1>
        <p>La page que vous avez demandée n’existe pas ou a été déplacée.</p>
        <Link className="btn btn-primary" to="/">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}

export default NonTrouvee;
