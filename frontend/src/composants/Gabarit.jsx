import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { getCategories } from '../services/api.js';

function Gabarit() {
  const [categories, setCategories] = useState([]);

  // Chargées une seule fois ici, puis distribuées au header et au footer.
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <>
      <a className="evitement" href="#contenu">
        Aller au contenu
      </a>

      <Header categories={categories} />

      <main id="contenu">
        <Outlet context={categories} />
      </main>

      <Footer categories={categories} />
    </>
  );
}

export default Gabarit;
