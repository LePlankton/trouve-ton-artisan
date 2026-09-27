const BASE = import.meta.env.VITE_API_URL;

// Un seul endroit pour appeler l'API et traiter les erreurs.
async function appeler(chemin, options) {
  const reponse = await fetch(`${BASE}${chemin}`, options);

  if (!reponse.ok) {
    const corps = await reponse.json().catch(() => ({}));
    throw new Error(corps.message ?? 'Une erreur est survenue.');
  }

  return reponse.json();
}

export const getCategories = () => appeler('/categories');

export const getArtisansDuMois = () => appeler('/artisans/top');

export const getArtisan = (id) => appeler(`/artisans/${id}`);

export const getArtisans = (filtres = {}) =>
  appeler(`/artisans?${new URLSearchParams(filtres)}`);

export const envoyerMessage = (id, donnees) =>
  appeler(`/artisans/${id}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees),
  });
