import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gabarit from './composants/Gabarit.jsx';
import Accueil from './pages/Accueil.jsx';
import Categorie from './pages/Categorie.jsx';
import Recherche from './pages/Recherche.jsx';
import Artisan from './pages/Artisan.jsx';
import NonTrouvee from './pages/NonTrouvee.jsx';
import PageLegale from './pages/PageLegale.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Gabarit />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/categorie/:id" element={<Categorie />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/artisan/:id" element={<Artisan />} />
          <Route
            path="/mentions-legales"
            element={<PageLegale titre="Mentions légales" />}
          />
          <Route
            path="/donnees-personnelles"
            element={<PageLegale titre="Données personnelles" />}
          />
          <Route
            path="/accessibilite"
            element={<PageLegale titre="Accessibilité" />}
          />
          <Route path="/cookies" element={<PageLegale titre="Cookies" />} />
          <Route path="*" element={<NonTrouvee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
