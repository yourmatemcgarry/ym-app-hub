// YOUR MATES BREWING — App Hub management links API
// ===================================================
// Password-protected links. The password is checked HERE, on the server,
// so the management links are never sent to a browser without it
// (unlike a password check in page JavaScript, which anyone could bypass).
//
//   POST /api/management  { password }          -> returns the links
//   PUT  /api/management  { password, links }   -> saves the links
//
// To change the password: edit the fallback below, or (better) set a
// MANAGEMENT_PASSWORD environment variable in Netlify's site settings,
// which takes priority over this file.

import { getStore } from "@netlify/blobs";
import { timingSafeEqual } from "node:crypto";

const PASSWORD = process.env.MANAGEMENT_PASSWORD || "Yourmatelarry2013";
const KEY = "management-links";
const HEADERS = { "Cache-Control": "no-store" };

function passwordOk(candidate) {
  if (typeof candidate !== "string") return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST, PUT" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: HEADERS });
  }

  if (!passwordOk(body && body.password)) {
    await sleep(700); // slows down password guessing
    return Response.json({ error: "Incorrect password" }, { status: 401, headers: HEADERS });
  }

  const store = getStore("app-hub");

  if (req.method === "POST") {
    const data = await store.get(KEY, { type: "json" });
    return Response.json(data ?? [], { headers: HEADERS });
  }

  if (!Array.isArray(body.links)) {
    return Response.json({ error: "Expected an array of links" }, { status: 400, headers: HEADERS });
  }
  await store.setJSON(KEY, body.links);
  return Response.json({ ok: true }, { headers: HEADERS });
};

export const config = {
  path: "/api/management",
};
