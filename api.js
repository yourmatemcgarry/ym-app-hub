/*
  YOUR MATES BREWING — App Hub API client
  =========================================
  Talks to the real backend at /api/links (netlify/functions/links.mjs),
  which stores the list in Netlify Blobs. Same-origin, so no setup, no
  CORS, no config file — just works once this site is deployed.
*/

window.LinksAPI = {
  async list() {
    const res = await fetch('/api/links', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load links (HTTP ' + res.status + ')');
    return res.json();
  },

  async save(links) {
    const res = await fetch('/api/links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(links),
    });
    if (!res.ok) throw new Error('Could not save links (HTTP ' + res.status + ')');
    return res.json();
  },
};
