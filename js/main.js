/* =========================================================
   NitraXShoP — main.js (thème Nebula)
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.SHOP_CONFIG;
  const T = window.I18N;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- état ---------- */
  let lang = localStorage.getItem("shop_lang") || "fr";
  let scheme = localStorage.getItem("shop_scheme") || "dark";
  let cart = load("shop_cart", []);
  let category = "all";
  let query = "";
  let paypalButtons = null;

  function load(key, fb) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; }
    catch (e) { return fb; }
  }
  const saveCart = () => localStorage.setItem("shop_cart", JSON.stringify(cart));

  /* ---------- i18n ---------- */
  const t = (k) => (T[lang] && T[lang][k]) || T.fr[k] || k;
  const L = (o) => (o && (o[lang] || o.fr)) || "";

  function applyI18n() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => {
      const v = t(el.dataset.i18n);
      if (v) el.textContent = v;
    });
    $$("[data-i18n-ph]").forEach((el) => {
      const v = t(el.dataset.i18nPh);
      if (v) el.placeholder = v;
    });
    $("#langFlag").textContent = lang === "fr" ? "🇫🇷" : "🇬🇧";
    document.title = lang === "fr"
      ? "NitraXShoP — Nitro, Boosts et Comptes Discord"
      : "NitraXShoP — Nitro, Boosts and Discord Accounts";
    syncGhostEchoes();
  }

  function syncGhostEchoes() {
    const pairs = [
      [".sa-section-title", "#shopEcho"],
      ["#how .sa-section-title", "#howEcho"],
      ["#faq .sa-section-title", "#faqEcho"]
    ];
    pairs.forEach(([sel, echoSel]) => {
      const el = $(sel), echo = $(echoSel);
      if (el && echo) echo.textContent = el.textContent.trim();
    });
  }

  /* ---------- thème (couleurs + dark/light) ---------- */
  function applyThemeColors() {
    const th = CFG.theme;
    if (!th) return;
    const r = document.documentElement.style;
    if (th.accent) r.setProperty("--accent", th.accent);
    if (th.gradFrom) r.setProperty("--grad-from", th.gradFrom);
    if (th.gradTo) r.setProperty("--grad-to", th.gradTo);
    if (th.onAccent) r.setProperty("--on-accent", th.onAccent);
  }

  function applyScheme() {
    document.documentElement.setAttribute("data-scheme", scheme);
  }
  function toggleScheme() {
    scheme = scheme === "dark" ? "light" : "dark";
    localStorage.setItem("shop_scheme", scheme);
    applyScheme();
  }

  /* ---------- money ---------- */
  const moneyFmt = () =>
    new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-IE", { style: "currency", currency: "EUR" });
  const money = (n) => moneyFmt().format(n);
  const byId = (id) => CFG.products.find((p) => p.id === id);

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg, ok) {
    const el = $("#toast");
    el.textContent = msg;
    el.className = "toast is-visible " + (ok === false ? "toast--err" : "toast--ok");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
  }

  /* =========================================================
     ONGLETS CATÉGORIE
     ========================================================= */
  function renderTabs() {
    $("#tabs").innerHTML = CFG.categories
      .map((c) => `
        <button class="tab ${category === c.id ? "is-active" : ""}" data-cat="${c.id}">
          <span>${c.icon}</span> ${L(c.label)}
        </button>`)
      .join("");
  }

  /* =========================================================
     PRODUITS
     ========================================================= */
  function badgeHtml(p) {
    if (p.oldPrice && p.price) {
      const pct = Math.round((1 - p.price / p.oldPrice) * 100);
      return `<span class="pcard__badge badge--promo">${t("promo").replace("{n}", pct)}</span>`;
    }
    const map = { popular: ["popular", t("popular")], best: ["best", t("best")], new: ["new", t("new")] };
    const b = map[p.badge];
    return b ? `<span class="pcard__badge badge--${b[0]}">${b[1]}</span>` : "";
  }

  function renderProducts() {
    const list = CFG.products.filter((p) => {
      const okCat = category === "all" || p.cat === category;
      const hay = (L(p.name) + " " + L(p.desc) + " " + p.id).toLowerCase();
      return okCat && hay.includes(query.toLowerCase());
    });

    $("#noResult").hidden = list.length > 0;
    $("#grid").innerHTML = list
      .map((p) => `
        <article class="pcard card-p hfx-spotlight reveal">
          ${badgeHtml(p)}
          <div class="pcard__media">
            ${p.img
              ? `<img src="${p.img}" alt="${L(p.name)}" loading="lazy" />`
              : `<span>${p.icon}</span>`}
          </div>
          <div class="pcard__body">
            <div class="pcard__top">
              <h3 class="pcard__title">${L(p.name)}</h3>
              <div class="pcard__price">
                ${p.oldPrice ? `<small><s>${money(p.oldPrice)}</s></small>` : `<small>&nbsp;</small>`}
                <b>${money(p.price)}</b>
              </div>
            </div>
            <span class="pcard__chip">⚡ ${t("hero_trust_1")}</span>
            <p class="pcard__desc">${L(p.desc)}</p>
            <div class="pcard__actions">
              <button class="sa-btn sa-btn--primary" data-buy="${p.id}">${t("buy")}</button>
              <button class="icon-cart" data-add="${p.id}" title="${t("add")}">＋</button>
            </div>
          </div>
        </article>`)
      .join("");

    observeReveals();
  }

  /* =========================================================
     MARQUEE (bandeau défilant de catégories)
     ========================================================= */
  function renderMarquee() {
    const items = [
      { icon: "💎", label: { fr: "Discord Nitro", en: "Discord Nitro" } },
      { icon: "🚀", label: { fr: "Boosts serveur", en: "Server Boosts" } },
      { icon: "👤", label: { fr: "Comptes Discord", en: "Discord Accounts" } },
      { icon: "🎁", label: { fr: "Liens cadeaux", en: "Gift Links" } },
      { icon: "⚡", label: { fr: "Livraison auto", en: "Auto Delivery" } },
      { icon: "🛡️", label: { fr: "Garantie 7 jours", en: "7-Day Warranty" } },
      { icon: "💳", label: { fr: "Stripe & PayPal", en: "Stripe & PayPal" } },
      { icon: "🔥", label: { fr: "Prix mini", en: "Lowest prices" } }
    ];
    const group = items
      .map((i) => `<span class="marquee-item"><span>${i.icon}</span>${L(i.label)}</span>`)
      .join("");
    $("#marqueeTrack").innerHTML =
      `<div class="marquee-group">${group}</div><div class="marquee-group" aria-hidden="true">${group}</div>`;
  }

  /* =========================================================
     FAQ
     ========================================================= */
  function renderFaq() {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `
        <div class="faq__item">
          <button class="faq__q"><span>${t("faq_" + i + "_q")}</span><span>＋</span></button>
          <div class="faq__a"><p>${t("faq_" + i + "_a")}</p></div>
        </div>`;
    }
    $("#faqList").innerHTML = html;
  }

  /* =========================================================
     PANIER
     ========================================================= */
  const cartLines = () => cart.map((l) => ({ ...l, product: byId(l.id) })).filter((l) => l.product);
  const cartCount = () => cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = () => cartLines().reduce((s, l) => s + l.qty * l.product.price, 0);

  function addToCart(id, silent) {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty++;
    else cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
    if (!silent) toast(`${L(byId(id).name)} ${t("added")}`);
  }

  function setQty(id, qty) {
    const line = cart.find((l) => l.id === id);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) cart = cart.filter((l) => l.id !== id);
    saveCart();
    renderCart();
  }

  function clearCart(silent) {
    cart = [];
    saveCart();
    renderCart();
    if (!silent) toast(t("clear") + " ✓");
  }

  function renderCart() {
    const lines = cartLines();
    $("#cartCount").textContent = cartCount();
    $("#cartEmpty").hidden = lines.length > 0;
    $("#cartFoot").hidden = lines.length === 0;
    $("#cartItems").hidden = lines.length === 0;

    $("#cartItems").innerHTML = lines
      .map((l) => `
        <div class="line">
          <div class="line__ico">${l.product.icon}</div>
          <div>
            <div class="line__name">${L(l.product.name)}</div>
            <div class="line__price">${money(l.product.price * l.qty)}</div>
          </div>
          <div class="line__ctrl">
            <div class="qty">
              <button data-dec="${l.id}">−</button>
              <span>${l.qty}</span>
              <button data-inc="${l.id}">＋</button>
            </div>
            <button class="line__del" data-del="${l.id}" title="${t("remove")}">✕</button>
          </div>
        </div>`)
      .join("");

    $("#cartSubtotal").textContent = money(cartTotal());
    $("#cartTotal").textContent = money(cartTotal());
    renderPaypal();
  }

  /* =========================================================
     PAYPAL
     ========================================================= */
  function loadPaypalSdk() {
    return new Promise((resolve, reject) => {
      if (window.paypal) return resolve();
      if (!CFG.payment.paypalClientId) return reject(new Error("no-client-id"));
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CFG.payment.paypalClientId)}&currency=EUR`;
      s.onload = resolve;
      s.onerror = () => reject(new Error("load-failed"));
      document.head.appendChild(s);
    });
  }

  function renderPaypal() {
    const mount = $("#paypalMount");
    if (paypalButtons) {
      try { paypalButtons.close(); } catch (e) {}
      paypalButtons = null;
    }
    mount.innerHTML = "";
    if (!CFG.payment.paypalClientId || cart.length === 0) return;

    loadPaypalSdk()
      .then(() => {
        if (cart.length === 0) return;
        paypalButtons = paypal.Buttons({
          style: { layout: "vertical", color: "blue", shape: "rect", label: "pay", height: 48 },
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{
                description: `NitraXShoP - ${cartCount()} article(s)`,
                amount: { currency_code: "EUR", value: cartTotal().toFixed(2) }
              }]
            }),
          onApprove: (data, actions) =>
            actions.order.capture().then((details) => {
              const name = (details.payer && details.payer.name && details.payer.name.given_name) || "";
              clearCart(true);
              closeDrawer();
              toast(t("order_ok") + (name ? " · " + name : ""));
            }),
          onError: () => toast("PayPal : " + t("paypal_missing"), false)
        });
        return paypalButtons.render(mount);
      })
      .catch(() => {});
  }

  /* =========================================================
     PAIEMENTS — disponibilité
     ========================================================= */
  const stripeLink = (id) => (CFG.payment.stripePaymentLinks || {})[id] || "";
  const paypalConfigured = () => !!(CFG.payment.paypalClientId && CFG.payment.paypalClientId.trim());
  const stripeConfigured = () => Object.values(CFG.payment.stripePaymentLinks || {}).some((v) => v && v.trim());

  function renderPayUI() {
    $("#stripeBtn").hidden = !stripeConfigured();
    $("#payEmpty").hidden = paypalConfigured() || stripeConfigured();
  }

  function buyNow(id) {
    const link = stripeLink(id);
    if (link) { window.open(link, "_blank", "noopener"); return; }
    addToCart(id);
    openDrawer();
    if (!paypalConfigured() && !stripeConfigured()) toast(t("pay_unavailable"), false);
  }

  function stripeCart() {
    const lines = cartLines();
    if (lines.length !== 1) { toast(t("stripe_one_item"), false); return; }
    const link = stripeLink(lines[0].id);
    if (!link) { toast(t("stripe_missing"), false); return; }
    window.open(link, "_blank", "noopener");
  }

  /* =========================================================
     DRAWER
     ========================================================= */
  function openDrawer() {
    $("#drawer").classList.add("is-open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    $("#drawer").classList.remove("is-open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#overlay").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* =========================================================
     PARTICULES DE FOND
     ========================================================= */
  function spawnParticles() {
    const wrap = $("#particles");
    wrap.innerHTML = "";
    const n = window.innerWidth < 640 ? 8 : 16;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("div");
      d.className = "pfx-dot";
      d.style.setProperty("--x", Math.random() * 100 + "%");
      d.style.setProperty("--s", 2 + Math.random() * 3 + "px");
      d.style.setProperty("--d", 12 + Math.random() * 16 + "s");
      d.style.setProperty("--delay", Math.random() * 18 + "s");
      wrap.appendChild(d);
    }
  }

  /* =========================================================
     SPOTLIGHT (effet souris sur cartes)
     ========================================================= */
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".hfx-spotlight");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });

  /* =========================================================
     REVEAL
     ========================================================= */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("is-in"), i * 60);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
    }
    $$(".reveal:not(.is-in)").forEach((el) => io.observe(el));
  }

  /* =========================================================
     CONTACT
     ========================================================= */
  function renderContact() {
    $("#discordLink").href = CFG.contact.discord;
    $("#footerDiscord").href = CFG.contact.discord;
    $("#mailLink").href = "mailto:" + CFG.contact.email;
    $("#footerMail").href = "mailto:" + CFG.contact.email;
    $("#mailTag").textContent = CFG.contact.email;
    try { $("#discordTag").textContent = CFG.contact.discord.replace(/^https?:\/\//, ""); } catch (e) {}
    $("#year").textContent = new Date().getFullYear();
  }

  /* =========================================================
     NAV ACTIVE (scroll)
     ========================================================= */
  function bindScrollSpy() {
    const sections = ["home", "shop", "how", "faq", "contact"].map((id) => document.getElementById(id));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        $$(".nav-pill, .mobile-link").forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => s && spy.observe(s));
  }

  /* =========================================================
     ÉVÉNEMENTS
     ========================================================= */
  function bind() {
    addEventListener("scroll", () => {
      $("#header").classList.toggle("is-stuck", scrollY > 10);
    });

    // burger
    $("#burger").addEventListener("click", () => {
      $("#burger").classList.toggle("is-open");
      $("#mobileMenu").classList.toggle("is-open");
    });
    $$("#mobileMenu a").forEach((a) =>
      a.addEventListener("click", () => {
        $("#burger").classList.remove("is-open");
        $("#mobileMenu").classList.remove("is-open");
      })
    );

    // langue
    $("#langBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      lang = lang === "fr" ? "en" : "fr";
      localStorage.setItem("shop_lang", lang);
      applyI18n();
      renderTabs();
      renderProducts();
      renderFaq();
      renderMarquee();
      renderCart();
    });

    // thème
    $("#schemeBtn").addEventListener("click", toggleScheme);

    // onglets + recherche
    $("#tabs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      category = b.dataset.cat;
      renderTabs();
      renderProducts();
    });
    $("#searchInput").addEventListener("input", (e) => {
      query = e.target.value.trim();
      renderProducts();
    });

    // actions produits
    $("#grid").addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      const buy = e.target.closest("[data-buy]");
      if (add) addToCart(add.dataset.add);
      if (buy) buyNow(buy.dataset.buy);
    });

    // panier
    $("#cartItems").addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const del = e.target.closest("[data-del]");
      if (inc) { const l = cart.find((x) => x.id === inc.dataset.inc); setQty(inc.dataset.inc, l.qty + 1); }
      if (dec) { const l = cart.find((x) => x.id === dec.dataset.dec); setQty(dec.dataset.dec, l.qty - 1); }
      if (del) setQty(del.dataset.del, 0);
    });

    $("#cartBtn").addEventListener("click", openDrawer);
    $("#drawerClose").addEventListener("click", closeDrawer);
    $("#overlay").addEventListener("click", closeDrawer);
    addEventListener("keydown", (e) => e.key === "Escape" && closeDrawer());
    $("#clearCart").addEventListener("click", () => clearCart());
    $("#stripeBtn").addEventListener("click", stripeCart);
    $("#payDiscord").href = CFG.contact.discord;

    // faq
    $("#faqList").addEventListener("click", (e) => {
      const q = e.target.closest(".faq__q");
      if (!q) return;
      const item = q.parentElement;
      const open = item.classList.contains("is-open");
      $$(".faq__item").forEach((i) => {
        i.classList.remove("is-open");
        $(".faq__a", i).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("is-open");
        const a = $(".faq__a", item);
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  }

  /* =========================================================
     PRODUITS EN LIGNE (panneau admin via Netlify Functions)
     ========================================================= */
  async function loadProducts() {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length) {
        CFG.products = data.products;
      }
    } catch (e) {
      /* hors-ligne : on garde les produits de config.js */
    }
  }

  /* =========================================================
     INIT
     ========================================================= */
  async function init() {
    await loadProducts();
    applyThemeColors();
    applyScheme();
    spawnParticles();
    applyI18n();
    renderTabs();
    renderProducts();
    renderMarquee();
    renderFaq();
    renderContact();
    renderPayUI();
    renderCart();
    bind();
    bindScrollSpy();
    observeReveals();
    setTimeout(syncGhostEchoes, 100);
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
