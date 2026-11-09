/*
  YOUR MATES BREWING — App Hub API client
  =========================================
  Talks to the real backend (netlify/functions/*.mjs, stored in Netlify
  Blobs). Same-origin, so no setup and no CORS.

    /api/links       public links (open to everyone)
    /api/management  management links (password checked on the server)
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

  // Throws Error('WRONG_PASSWORD') if the password is rejected.
  async mgmtList(password) {
    const res = await fetch('/api/management', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.status === 401) throw new Error('WRONG_PASSWORD');
    if (!res.ok) throw new Error('Could not load management links (HTTP ' + res.status + ')');
    return res.json();
  },

  async mgmtSave(password, links) {
    const res = await fetch('/api/management', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, links }),
    });
    if (res.status === 401) throw new Error('WRONG_PASSWORD');
    if (!res.ok) throw new Error('Could not save management links (HTTP ' + res.status + ')');
    return res.json();
  },
};
