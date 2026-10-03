import { Link } from 'react-router-dom';
import illustration from '../assets/illustration-404.svg';
import Seo from '../composants/Seo.jsx';

function NonTrouvee() {
  return (
    <>
      <Seo
        titre="Page non trouvée — Trouve ton artisan"
        description="Cette page n'existe pas ou a été déplacée. Revenez à l'accueil pour retrouver un artisan."
      />
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
    </>
  );
}

export default NonTrouvee;
