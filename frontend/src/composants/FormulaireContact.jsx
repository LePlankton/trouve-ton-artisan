import { useState } from 'react';
import { envoyerMessage } from '../services/api.js';

const VIDE = { nom: '', email: '', objet: '', message: '' };

function FormulaireContact({ artisan }) {
  const [champs, setChamps] = useState(VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [retour, setRetour] = useState(null); // { type: 'ok' | 'erreur', texte }

  function changer(evenement) {
    const { name, value } = evenement.target;
    setChamps({ ...champs, [name]: value });
  }

  async function soumettre(evenement) {
    evenement.preventDefault();
    setEnvoi(true);
    setRetour(null);

    try {
      const reponse = await envoyerMessage(artisan.id, champs);
      setRetour({ type: 'ok', texte: reponse.message });
      setChamps(VIDE);
    } catch (erreur) {
      setRetour({ type: 'erreur', texte: erreur.message });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="contact" onSubmit={soumettre}>
      <h2>Contacter cet artisan</h2>
      <p>Une réponse vous sera apportée sous 48h.</p>

      <label htmlFor="nom">
        Nom <span aria-hidden="true">*</span>
      </label>
      <input
        id="nom"
        name="nom"
        type="text"
        required
        placeholder="Votre nom"
        value={champs.nom}
        onChange={changer}
      />

      <label htmlFor="email">
        Email <span aria-hidden="true">*</span>
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="Votre email"
        value={champs.email}
        onChange={changer}
      />

      <label htmlFor="objet">
        Objet <span aria-hidden="true">*</span>
      </label>
      <input
        id="objet"
        name="objet"
        type="text"
        required
        placeholder="Objet du message"
        value={champs.objet}
        onChange={changer}
      />

      <label htmlFor="message">
        Message <span aria-hidden="true">*</span>
      </label>
      <textarea
        id="message"
        name="message"
        rows="5"
        required
        placeholder="Votre message"
        value={champs.message}
        onChange={changer}
      ></textarea>

      <button type="submit" className="btn btn-primary" disabled={envoi}>
        {envoi ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>

      <p className="obligatoires">* Champs obligatoires</p>

      {retour && (
        <p
          role="status"
          className={retour.type === 'ok' ? 'text-success' : 'text-danger'}
        >
          {retour.texte}
        </p>
      )}
    </form>
  );
}

export default FormulaireContact;
