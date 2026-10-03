import Seo from '../composants/Seo.jsx';

function PageLegale({ titre }) {
  return (
    <>
      <Seo
        titre={titre + ' — Trouve ton artisan'}
        description={`${titre} du site Trouve ton artisan, l’annuaire des artisans de la région Auvergne-Rhône-Alpes.`}
      />
      <section className="legal">
        <div className="container">
          <h1>{titre}</h1>
          <p className="chapeau">Page en construction.</p>
          <p>Ce contenu sera prochainement mis en ligne.</p>
        </div>
      </section>
    </>
  );
}

export default PageLegale;
