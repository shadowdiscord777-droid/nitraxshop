const STORE = "shop";
const KEY = "products";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: CORS });

function cleanProducts(input) {
  if (!Array.isArray(input)) return null;
  const out = [];
  for (const p of input) {
    if (!p || typeof p !== "object") continue;
    const id = String(p.id || "").trim();
    if (!id) continue;
    const num = (v) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
    };
    const str = (v) => String(v == null ? "" : v);
    const loc = (v) => ({ fr: str(v && v.fr), en: str(v && v.en) });
    const feats = (arr) =>
      Array.isArray(arr)
        ? arr
            .map((f) => loc(f))
            .filter((f) => f.fr || f.en)
        : [];
    out.push({
      id,
      cat: str(p.cat || "nitro"),
      icon: str(p.icon),
      img: str(p.img),
      price: num(p.price),
      oldPrice: p.oldPrice ? num(p.oldPrice) : undefined,
      badge: str(p.badge),
      name: loc(p.name),
      desc: loc(p.desc),
      features: feats(p.features)
    });
  }
  return out;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return json({ error: "bad_json" }, 400);
  }

  const password = process.env.ADMIN_PASSWORD || "";
  if (!password || body.password !== password) {
    return json({ error: "unauthorized" }, 401);
  }

  const products = cleanProducts(body.products);
  if (!products) {
    return json({ error: "invalid_products" }, 400);
  }

  const site = process.env.SHOP_SITE_ID;
  const token = process.env.SHOP_TOKEN;
  if (!site || !token) {
    return json({ error: "server_not_configured" }, 500);
  }

  const res = await fetch(
    `https://api.netlify.com/api/v1/blobs/${site}/${STORE}/${KEY}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(products)
    }
  );

  if (!res.ok) {
    return json({ error: "save_failed", status: res.status }, 500);
  }

  return json({ ok: true, count: products.length });
};
