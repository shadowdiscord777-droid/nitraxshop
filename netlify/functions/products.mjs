const STORE = "shop";
const KEY = "products";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

async function readProducts() {
  const site = process.env.SHOP_SITE_ID;
  const token = process.env.SHOP_TOKEN;
  if (!site || !token) return null;

  const res = await fetch(
    `https://api.netlify.com/api/v1/blobs/${site}/${STORE}/${KEY}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;

  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  try {
    const products = await readProducts();
    return new Response(JSON.stringify({ products }), { status: 200, headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ products: null, error: "read_failed" }), {
      status: 200,
      headers: CORS
    });
  }
};
