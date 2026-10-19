window.SHOP_CONFIG = {
  brand: "NitraXShoP",

  currency: "€",
  locale: "fr_FR",

  /*
   * THÈME — couleurs du site
   * accent est en format RGB (r,g,b), les dégradés en hex.
   * Exemples : rose magenta 240,2,225 · bleu 88,101,242 · vert 16,185,129
   */
  theme: {
    accent: "240,2,225",
    gradFrom: "#ff4de9",
    gradTo: "#f002e1",
    onAccent: "28,21,9"
  },

  contact: {
    discord: "https://discord.gg/TON-LIEN-DISCORD",
    email: "contact@tonshop.fr",
    twitter: "https://twitter.com/toncompte"
  },

  /*
   * PAIEMENTS
   * --------------------------------------------------------------------------
   * Stripe : crée un "Payment Link" pour CHAQUE produit dans ton dashboard
   *          (https://dashboard.stripe.com/payment-links) puis colle l'URL ici.
   *          Laisse "" si le produit n'est pas encore configuré.
   *
   * PayPal : mets ton Client ID public (Apps & Credentials > REST APIs).
   *          Fonctionne avec le panier, prix multiples inclus.
   */
  payment: {
    paypalClientId: "",
    stripePaymentLinks: {
      "nitro-basic-1m": "https://buy.stripe.com/9B63cu4LrfFV4aB3uJ8bS00",
      "nitro-1m": "https://buy.stripe.com/7sYbJ03Hn9hxbD3e9n8bS01",
      "nitro-3m": "https://buy.stripe.com/cNi00idhX1P54aBc1f8bS02",
      "nitro-12m": "https://buy.stripe.com/28E8wO6TzdxN22t6GV8bS03",
      "boost-2": "https://buy.stripe.com/28EaEWb9PgJZdLbaXb8bS04",
      "boost-14": "https://buy.stripe.com/14A3cu6Tz79pfTje9n8bS05",
      "boost-28": "https://buy.stripe.com/aFa28q4LrbpF9uV9T78bS06",
      "compte-verifie": "https://buy.stripe.com/6oU3cuem1dxN36xfdr8bS07",
      "compte-ancien": "https://buy.stripe.com/5kQaEWem1ctJbD3c1f8bS08",
      "compte-nitro": "https://buy.stripe.com/cNi5kCfq51P5dLbc1f8bS09",
      "compte-vip": "https://buy.stripe.com/cNi6oG3HnctJ4aBe9n8bS0a",
    }
  },

  categories: [
    { id: "all", icon: "✨", label: { fr: "Tout", en: "All" } },
    { id: "nitro", icon: "💎", label: { fr: "Nitro", en: "Nitro" } },
    { id: "boost", icon: "🚀", label: { fr: "Boosts", en: "Boosts" } },
    { id: "compte", icon: "👤", label: { fr: "Comptes", en: "Accounts" } }
  ],

  products: [
    {
      id: "nitro-basic-1m",
      cat: "nitro",
      icon: "🔹",
      img: "assets/img/nitro-basic.svg",
      price: 2.99,
      oldPrice: 4.99,
      badge: "promo",
      name: { fr: "Nitro Basic — 1 mois", en: "Nitro Basic — 1 month" },
      desc: {
        fr: "Emoji illimités, 50 Mo d'upload et badge Nitro Basic sur ton profil.",
        en: "Unlimited emoji, 50 MB uploads and the Nitro Basic badge on your profile."
      },
      features: [
        { fr: "Emoji personnalisés partout", en: "Custom emoji anywhere" },
        { fr: "Upload 50 Mo", en: "50 MB uploads" },
        { fr: "Livraison en moins de 5 min", en: "Delivery in under 5 min" }
      ]
    },
    {
      id: "nitro-1m",
      cat: "nitro",
      icon: "💎",
      img: "assets/img/nitro-1m.svg",
      price: 4.99,
      oldPrice: 7.99,
      badge: "popular",
      name: { fr: "Discord Nitro — 1 mois", en: "Discord Nitro — 1 month" },
      desc: {
        fr: "Le Nitro complet : streaming HD, 500 Mo d'upload, boosts et profils custom.",
        en: "Full Nitro: HD streaming, 500 MB uploads, boosts and custom profiles."
      },
      features: [
        { fr: "Streaming 1080p60", en: "1080p60 streaming" },
        { fr: "Upload 500 Mo", en: "500 MB uploads" },
        { fr: "2 boosts serveur inclus", en: "2 server boosts included" },
        { fr: "Livraison instantanée", en: "Instant delivery" }
      ]
    },
    {
      id: "nitro-3m",
      cat: "nitro",
      icon: "💠",
      img: "assets/img/nitro-3m.svg",
      price: 12.99,
      oldPrice: 23.99,
      badge: "promo",
      name: { fr: "Discord Nitro — 3 mois", en: "Discord Nitro — 3 months" },
      desc: {
        fr: "3 mois de Nitro complet au meilleur prix, livré sur ton compte en minutes.",
        en: "3 months of full Nitro at the best price, delivered to your account in minutes."
      },
      features: [
        { fr: "Toutes les fonctionnalités Nitro", en: "All Nitro features" },
        { fr: "6 boosts serveur", en: "6 server boosts" },
        { fr: "Économie de 45 %", en: "Save 45%" }
      ]
    },
    {
      id: "nitro-12m",
      cat: "nitro",
      icon: "👑",
      img: "assets/img/nitro-12m.svg",
      price: 39.99,
      oldPrice: 79.99,
      badge: "best",
      name: { fr: "Discord Nitro — 1 an", en: "Discord Nitro — 1 year" },
      desc: {
        fr: "12 mois de Nitro complet. Le meilleur rapport qualité/prix de la boutique.",
        en: "12 months of full Nitro. The best value in the shop."
      },
      features: [
        { fr: "24 boosts serveur", en: "24 server boosts" },
        { fr: "Économie de 50 %", en: "Save 50%" },
        { fr: "Support prioritaire", en: "Priority support" }
      ]
    },
    {
      id: "boost-2",
      cat: "boost",
      icon: "⚡",
      img: "assets/img/boost-2.svg",
      price: 3.99,
      badge: "",
      name: { fr: "2 Boosts serveur", en: "2 Server Boosts" },
      desc: {
        fr: "Deux boosts pour faire passer ton serveur au niveau 1 (24/7 audio).",
        en: "Two boosts to get your server to level 1 (24/7 audio)."
      },
      features: [
        { fr: "Niveau 1 : audio 128 kbps", en: "Level 1: 128 kbps audio" },
        { fr: "Validité 1 mois", en: "1 month validity" }
      ]
    },
    {
      id: "boost-14",
      cat: "boost",
      icon: "🚀",
      img: "assets/img/boost-14.svg",
      price: 24.99,
      oldPrice: 34.99,
      badge: "popular",
      name: { fr: "14 Boosts — Niveau 2", en: "14 Boosts — Level 2" },
      desc: {
        fr: "Le pack complet pour débloquer le niveau 2 : 50 % d'expéditeur, 128 kbps et icône de serveur.",
        en: "The full pack to unlock level 2: 50% upload, 128 kbps and server icon."
      },
      features: [
        { fr: "Niveau 2 débloqué", en: "Level 2 unlocked" },
        { fr: "Bannière de serveur", en: "Server banner" },
        { fr: "Validité 1 mois", en: "1 month validity" }
      ]
    },
    {
      id: "boost-28",
      cat: "boost",
      icon: "🔥",
      img: "assets/img/boost-28.svg",
      price: 44.99,
      oldPrice: 59.99,
      badge: "best",
      name: { fr: "28 Boosts — Niveau 3", en: "28 Boosts — Level 3" },
      desc: {
        fr: "Le niveau maximum : 384 kbps audio, upload illimité et goodies exclusifs.",
        en: "Maximum level: 384 kbps audio, unlimited upload and exclusive perks."
      },
      features: [
        { fr: "Niveau 3 débloqué", en: "Level 3 unlocked" },
        { fr: "Audio 384 kbps", en: "384 kbps audio" },
        { fr: "URL personnalisée", en: "Vanity URL" }
      ]
    },
    {
      id: "compte-verifie",
      cat: "compte",
      icon: "✅",
      img: "assets/img/compte-verifie.svg",
      price: 3.49,
      badge: "",
      name: { fr: "Compte Discord vérifié", en: "Verified Discord Account" },
      desc: {
        fr: "Compte avec e-mail et numéro de téléphone vérifiés, prêt à l'emploi.",
        en: "Account with verified email and phone number, ready to use."
      },
      features: [
        { fr: "E-mail vérifié", en: "Verified email" },
        { fr: "Téléphone vérifié", en: "Verified phone" },
        { fr: "Aucune restriction", en: "No restrictions" }
      ]
    },
    {
      id: "compte-ancien",
      cat: "compte",
      icon: "🕰️",
      img: "assets/img/compte-ancien.svg",
      price: 5.99,
      oldPrice: 8.99,
      badge: "popular",
      name: { fr: "Compte âgé 2 ans +", en: "2+ Year Old Account" },
      desc: {
        fr: "Compte créé il y a plus de 2 ans : plus de crédibilité et moins de restrictions.",
        en: "Account created 2+ years ago: more credibility, fewer restrictions."
      },
      features: [
        { fr: "Ancienneté 24 mois min.", en: "24+ months old" },
        { fr: "Sans strikes", en: "No strikes" },
        { fr: "Changement de mot de passe inclus", en: "Password change included" }
      ]
    },
    {
      id: "compte-nitro",
      cat: "compte",
      icon: "💎",
      img: "assets/img/compte-nitro.svg",
      price: 7.99,
      badge: "promo",
      name: { fr: "Compte avec Nitro", en: "Account with Nitro" },
      desc: {
        fr: "Un compte qui possède déjà un abonnement Nitro actif, livré avec ses accès.",
        en: "An account that already owns an active Nitro subscription, delivered with its credentials."
      },
      features: [
        { fr: "Nitro actif", en: "Active Nitro" },
        { fr: "Accès complet fourni", en: "Full credentials provided" },
        { fr: "Garantie 7 jours", en: "7-day warranty" }
      ]
    },
    {
      id: "compte-vip",
      cat: "compte",
      icon: "🏆",
      img: "assets/img/compte-vip.svg",
      price: 12.99,
      oldPrice: 17.99,
      badge: "best",
      name: { fr: "Compte Nitro + Ancienneté", en: "Nitro + Aged Account" },
      desc: {
        fr: "Notre compte premium : Nitro actif, ancien et vérifié. Le top de la boutique.",
        en: "Our premium account: active Nitro, aged and verified. The top of the shop."
      },
      features: [
        { fr: "Nitro actif", en: "Active Nitro" },
        { fr: "Compte 3 ans +", en: "3+ year account" },
        { fr: "Téléphone vérifié", en: "Verified phone" },
        { fr: "Garantie 30 jours", en: "30-day warranty" }
      ]
    }
  ]
};
