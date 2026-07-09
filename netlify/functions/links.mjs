// YOUR MATES BREWING — App Hub API
// ==================================
// Real backend for the link list, same pattern as your other Netlify
// apps: a Function reads/writes Netlify Blobs (built-in storage, no
// database to set up). index.html and admin.html both call this at
// /api/links — GET to read, PUT to save. No manual publish step.

import { getStore } from "@netlify/blobs";

const KEY = "links";

// Used only the very first time this runs, before anyone has saved
// anything yet (i.e. the store is still empty).
const SEED = [
  {
    id: "l_mrd2jtirc95wz",
    name: "Event & Gear Bookings & Tracker",
    url: "https://ym-event-tracker.netlify.app/",
    description: "Book in a future sales & marketing event here",
    icon: "🔗",
  },
  {
    id: "l_mrd2l7d60is3r",
    name: "Sales CRM Pricing Guide",
    url: "https://ym-crm-price-guide.netlify.app/",
    description: "Source of truth for all customer deals and wholesale pricing",
    icon: "🔗",
  },
];

export default async (req) => {
  const store = getStore("app-hub");

  if (req.method === "GET") {
    const data = await store.get(KEY, { type: "json" });
    return Response.json(data ?? SEED);
  }

  if (req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!Array.isArray(body)) {
      return Response.json({ error: "Expected an array of links" }, { status: 400 });
    }
    await store.setJSON(KEY, body);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { Allow: "GET, PUT" },
  });
};

export const config = {
  path: "/api/links",
};
