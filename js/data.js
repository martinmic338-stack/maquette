/* ============================================
   JMARK SUPER MARCHÉ — Données du prototype
   (fichier local — aucun backend)
   ============================================ */

window.JMARK = (function () {
  'use strict';

  var SHIPPING = 2000;                 // frais de livraison (FC)
  var FREE_SHIPPING_ABOVE = 100000;    // livraison offerte au-dessus de ce montant

  /* ---------- Catégories ---------- */
  var CATEGORIES = [
    { key: 'Fruits & Légumes', emoji: '🥬', image: 'assets/categories/fruits-legumes.svg', color: '#16a34a', desc: 'Fruits et légumes frais du jour' },
    { key: 'Épicerie', emoji: '🛒', image: 'assets/categories/epicerie.svg', color: '#d97706', desc: 'Riz, huile, conserves et essentiels' },
    { key: 'Boissons', emoji: '🥤', image: 'assets/categories/boissons.svg', color: '#0891b2', desc: 'Jus, eaux et sodas' },
    { key: 'Produits frais', emoji: '❄️', image: 'assets/categories/produits-frais.svg', color: '#0e7490', desc: 'Lait, viande, poisson et œufs' },
    { key: 'Hygiène & Beauté', emoji: '🧴', image: 'assets/categories/hygiene-beaute.svg', color: '#7c3aed', desc: 'Soins du corps et de la maison' },
    { key: 'Maison', emoji: '🏠', image: 'assets/categories/maison.svg', color: '#64748b', desc: 'Entretien et équipement de la maison' }
  ];

  /* ---------- Produits ---------- */
  var PRODUCTS = [
    /* ----- Fruits & Légumes ----- */
    { id: 1, name: 'Tomates fraîches', category: 'Fruits & Légumes', price: 1500, oldPrice: 1900, discount: 20, unit: 'le kg', image: 'assets/products/tomates.svg', badge: 'Populaire', available: true,
      description: 'Tomates mûres et juteuses, sélectionnées chaque matin sur le marché. Parfaites pour les salades, sauces et ragouts.' },
    { id: 2, name: 'Bananes plantain', category: 'Fruits & Légumes', price: 3200, oldPrice: 3800, discount: 16, unit: 'le régime', image: 'assets/products/bananes.svg', badge: '', available: true,
      description: 'Bananes plantain mûres à point, idéales pour les frites, makemba ou à la braise. Culture locale de qualité.' },
    { id: 3, name: 'Oignons', category: 'Fruits & Légumes', price: 2500, oldPrice: 3000, discount: 17, unit: 'le kg', image: 'assets/products/oignons.svg', badge: '', available: true,
      description: 'Oignons frais, fermes et bien conservés. Un indispensable de toutes vos préparations.' },
    { id: 4, name: 'Carottes', category: 'Fruits & Légumes', price: 2500, oldPrice: 2900, discount: 14, unit: 'le kg', image: 'assets/products/carottes.svg', badge: '', available: true,
      description: 'Carottes croquantes et sucrées, riches en vitamines. Idéales pour les soupes et les plats mijotés.' },
    { id: 5, name: 'Avocats', category: 'Fruits & Légumes', price: 1800, oldPrice: 2200, discount: 18, unit: 'les 3', image: 'assets/products/avocats.svg', badge: 'Nouveau', available: true,
      description: 'Avocats frais et crémeux, parfaits pour vos salades, sandwichs et sauces. Riche en bons nutriments.' },
    { id: 6, name: 'Feuilles de manioc (pondu)', category: 'Fruits & Légumes', price: 1200, oldPrice: 1500, discount: 20, unit: 'la botte', image: 'assets/products/pondu.svg', badge: '', available: true,
      description: 'Feuilles de manioc fraîchement cueillies, prêtes pour votre pondu à l’huile de palme. Saveur authentique.' },

    /* ----- Épicerie ----- */
    { id: 7, name: 'Riz parfumé 5 kg', category: 'Épicerie', price: 24500, oldPrice: 28000, discount: 13, unit: 'sac de 5 kg', image: 'assets/products/riz.svg', badge: 'Populaire', available: true,
      description: 'Riz long grain parfumé de première qualité. Grains légers et séparés après cuisson. Le favori des foyers.' },
    { id: 8, name: 'Huile végétale 5 L', category: 'Épicerie', price: 35000, oldPrice: 39500, discount: 11, unit: 'bidon de 5 L', image: 'assets/products/huile.svg', badge: '', available: true,
      description: 'Huile végétale raffinée adaptée à toutes vos fritures et préparations. Bidon pratique de 5 litres.' },
    { id: 9, name: 'Sucre en poudre 1 kg', category: 'Épicerie', price: 4000, oldPrice: 4600, discount: 13, unit: 'le kg', image: 'assets/products/sucre.svg', badge: '', available: true,
      description: 'Sucre blanc cristallisé pour vos boissons, desserts et préparations quotidiennes.' },
    { id: 10, name: 'Farine de blé 1 kg', category: 'Épicerie', price: 3800, oldPrice: 4300, discount: 12, unit: 'le kg', image: 'assets/products/farine.svg', badge: '', available: true,
      description: 'Farine de blé tout usage pour pains, beignets, crêpes et pâtisseries maison.' },
    { id: 11, name: 'Pâtes alimentaires', category: 'Épicerie', price: 1800, oldPrice: 2100, discount: 14, unit: 'paquet de 500 g', image: 'assets/products/pates.svg', badge: '', available: true,
      description: 'Pâtes alimentaires au blé dur, cuisson rapide. La base de vos plats rapides et savoureux.' },
    { id: 12, name: 'Café soluble 200 g', category: 'Épicerie', price: 9500, oldPrice: 11000, discount: 14, unit: 'pot de 200 g', image: 'assets/products/cafe.svg', badge: '', available: true,
      description: 'Café soluble riche en arômes. Votre tasse de café chaude en quelques secondes.' },
    { id: 13, name: 'Thon en boîte', category: 'Épicerie', price: 7200, oldPrice: 8200, discount: 12, unit: 'boîte 140 g', image: 'assets/products/thon.svg', badge: 'Populaire', available: true,
      description: 'Filets de thon au naturel ou à l’huile, idéals pour les sandwichs et salades rapides.' },
    { id: 14, name: 'Sel de cuisine 1 kg', category: 'Épicerie', price: 1500, oldPrice: 1700, discount: 12, unit: 'le kg', image: 'assets/products/sel.svg', badge: '', available: true,
      description: 'Sel raffiné iodé pour l’assaisonnement de tous vos plats.' },

    /* ----- Boissons ----- */
    { id: 15, name: 'Jus d’orange', category: 'Boissons', price: 6000, oldPrice: 7200, discount: 17, unit: 'bouteille 1 L', image: 'assets/products/jus-orange.svg', badge: 'Nouveau', available: true,
      description: 'Pur jus d’orange fraîchement pressé, sans conservateurs. La vitalité des agrumes dans votre verre.' },
    { id: 16, name: 'Jus de bissap', category: 'Boissons', price: 3500, oldPrice: 4200, discount: 17, unit: 'bouteille 1 L', image: 'assets/products/jus-bissap.svg', badge: 'Populaire', available: true,
      description: 'Jus de bissap préparé à partir des fleurs d’hibiscus. Une boisson traditionnelle, rafraîchissante et naturellement colorée.' },
    { id: 17, name: 'Jus de gingembre', category: 'Boissons', price: 3500, oldPrice: 4000, discount: 13, unit: 'bouteille 1 L', image: 'assets/products/jus-gingembre.svg', badge: '', available: true,
      description: 'Jus de gingembre pétillant et légèrement épicé. Une boisson énergisante préparée avec du vrai gingembre frais.' },
    { id: 18, name: 'Eau minérale 1,5 L', category: 'Boissons', price: 1500, oldPrice: 1700, discount: 12, unit: 'bouteille 1,5 L', image: 'assets/products/eau.svg', badge: '', available: true,
      description: 'Eau minérale naturelle pure et équilibrée, idéale pour toute la famille.' },
    { id: 19, name: 'Soda citron 1,5 L', category: 'Boissons', price: 2500, oldPrice: 2900, discount: 14, unit: 'bouteille 1,5 L', image: 'assets/products/soda.svg', badge: '', available: true,
      description: 'Soda au citron bien frais, gazéifié et désaltérant pour toute la famille.' },

    /* ----- Produits frais ----- */
    { id: 20, name: 'Lait frais 1 L', category: 'Produits frais', price: 6000, oldPrice: 6800, discount: 12, unit: 'brique 1 L', image: 'assets/products/lait.svg', badge: '', available: true,
      description: 'Lait frais entier pasteurisé, riche en calcium. Conserver au frais.' },
    { id: 21, name: 'Yaourt nature', category: 'Produits frais', price: 3500, oldPrice: 4000, discount: 13, unit: 'pot de 500 g', image: 'assets/products/yaourt.svg', badge: '', available: true,
      description: 'Yaourt nature onctueux au lait entier, à déguster nature ou avec des fruits.' },
    { id: 22, name: 'Poulet fermier', category: 'Produits frais', price: 15000, oldPrice: 18000, discount: 17, unit: 'le kg', image: 'assets/products/poulet.svg', badge: 'Populaire', available: true,
      description: 'Poulet fermier frais, élevé en plein air, apprêté et prêt à cuisiner.' },
    { id: 23, name: 'Poisson frais (tilapia)', category: 'Produits frais', price: 12000, oldPrice: 14500, discount: 17, unit: 'le kg', image: 'assets/products/poisson.svg', badge: 'Nouveau', available: true,
      description: 'Tilapia frais du jour, parfait pour les braises, poisson à la sauce ou liboke.' },
    { id: 24, name: 'Œufs (12 pièces)', category: 'Produits frais', price: 5000, oldPrice: 5700, discount: 12, unit: 'la douzaine', image: 'assets/products/oeufs.svg', badge: '', available: true,
      description: 'Œufs frais de poule élevée en plein air. Calibre moyen à gros.' },
    { id: 25, name: 'Beurre 250 g', category: 'Produits frais', price: 10000, oldPrice: 11500, discount: 13, unit: 'plaquette de 250 g', image: 'assets/products/beurre.svg', badge: '', available: true,
      description: 'Beurre doux 82% matière grasse. Pour tartines et pâtisseries.' },
    { id: 26, name: 'Fromage 200 g', category: 'Produits frais', price: 9000, oldPrice: 10500, discount: 14, unit: 'portion de 200 g', image: 'assets/products/fromage.svg', badge: '', available: true,
      description: 'Fromage fondu crémeux, délicieux en sandwich ou dans vos sauces.' },

    /* ----- Hygiène & Beauté ----- */
    { id: 27, name: 'Savon de toilette', category: 'Hygiène & Beauté', price: 1500, oldPrice: 1800, discount: 17, unit: 'barre de 200 g', image: 'assets/products/savon.svg', badge: '', available: true,
      description: 'Savon de toilette doux pour la peau, agréablement parfumé. Usage quotidien.' },
    { id: 28, name: 'Dentifrice', category: 'Hygiène & Beauté', price: 3500, oldPrice: 4200, discount: 17, unit: 'tube 100 ml', image: 'assets/products/dentifrice.svg', badge: 'Nouveau', available: true,
      description: 'Dentifrice au fluor pour une protection complète contre les caries et une haleine fraîche.' },
    { id: 29, name: 'Shampoing 400 ml', category: 'Hygiène & Beauté', price: 9000, oldPrice: 10500, discount: 14, unit: 'flacon 400 ml', image: 'assets/products/shampoing.svg', badge: '', available: true,
      description: 'Shampoing doux pour cheveux normaux, nettoie en profondeur sans les assécher.' },
    { id: 30, name: 'Gel douche', category: 'Hygiène & Beauté', price: 8000, oldPrice: 9500, discount: 16, unit: 'flacon 500 ml', image: 'assets/products/gel-douche.svg', badge: '', available: true,
      description: 'Gel douche onctueux au pH adapté. Laisse la peau propre et douce.' },
    { id: 31, name: 'Papier toilette (6 rouleaux)', category: 'Hygiène & Beauté', price: 8000, oldPrice: 9000, discount: 11, unit: 'pack de 6', image: 'assets/products/papier-toilette.svg', badge: '', available: true,
      description: 'Papier toilette ultra doux, 3 épaisseurs, format confort en pack économique.' },

    /* ----- Maison ----- */
    { id: 32, name: 'Lessive poudre 1 kg', category: 'Maison', price: 6500, oldPrice: 7500, discount: 13, unit: 'boîte 1 kg', image: 'assets/products/lessive.svg', badge: 'Populaire', available: true,
      description: 'Lessive en poudre au pouvoir dégraissant efficace. Linge blanc éclatant et parfum persistant.' },
    { id: 33, name: 'Liquide vaisselle', category: 'Maison', price: 3500, oldPrice: 4200, discount: 17, unit: 'flacon 500 ml', image: 'assets/products/vaisselle.svg', badge: '', available: true,
      description: 'Liquide vaisselle concentré qui dégraisse rapidement tout en douceur pour vos mains.' },
    { id: 34, name: 'Bougies (pack)', category: 'Maison', price: 3000, oldPrice: 3600, discount: 17, unit: 'pack de 12', image: 'assets/products/bougies.svg', badge: '', available: true,
      description: 'Bougies longue durée pour l’éclairage de secours et les moments de convivialité.' }
  ];

  /* ---------- Bannières (Accueil) ---------- */
  var BANNERS = [
    {
      id: 1,
      title: 'Faites vos courses en ligne',
      subtitle: 'Rapide • Simple • Sécurisé',
      cta: 'Commandez maintenant',
      link: 'products.html',
      image: 'assets/banners/courses.svg',
      theme: 'red'
    },
    {
      id: 2,
      title: 'Découvrez nos produits frais',
      subtitle: 'Légumes, fruits, lait et viande sélectionnés chaque matin',
      cta: 'Explorer les produits frais',
      link: 'products.html?category=Produits%20frais',
      image: 'assets/banners/frais.svg',
      theme: 'green'
    },
    {
      id: 3,
      title: 'Profitez de nos promotions',
      subtitle: 'Jusqu’à −20 % sur une large sélection',
      cta: 'Voir les promotions',
      link: 'promotions.html',
      image: 'assets/banners/promos.svg',
      theme: 'orange'
    }
  ];

  /* ---------- Moyens de paiement ---------- */
  var PAYMENTS = [
    { id: 'mpesa', group: 'Mobile Money', label: 'M-Pesa', desc: 'Règlement instantané depuis votre téléphone', color: '#00A546', initials: 'M' },
    { id: 'airtel', group: 'Mobile Money', label: 'Airtel Money', desc: 'Règlement instantané depuis votre téléphone', color: '#E4002B', initials: 'A' },
    { id: 'orange', group: 'Mobile Money', label: 'Orange Money', desc: 'Règlement instantané depuis votre téléphone', color: '#FF7900', initials: 'O' },
    { id: 'card', group: 'Carte bancaire', label: 'Carte bancaire', desc: 'Visa / Mastercard (simulation)', color: '#1e293b', initials: 'C' },
    { id: 'cod', group: 'À la livraison', label: 'Paiement à la livraison', desc: 'Réglez en espèces à la réception', color: '#16a34a', initials: '₣' }
  ];

  /* ---------- Nos magasins ---------- */
  var STORES = [
    { name: 'JMARK Centre-ville', zone: 'Gombe', address: 'Avenue du Commerce n° 45, Kinshasa', hours: 'Lun – Sam : 8h00 – 21h00', phone: '+243 81 000 00 01', icon: '🏬' },
    { name: 'JMARK Marché Central', zone: 'Kalamu', address: 'Boulevard du 30 Juin, Kinshasa', hours: 'Lun – Dim : 7h30 – 22h00', phone: '+243 81 000 00 02', icon: '🏪' },
    { name: 'JMARK Rond-point', zone: 'Ngaliema', address: 'Avenue des Poids Lourds, Kinshasa', hours: 'Lun – Sam : 8h00 – 20h30', phone: '+243 81 000 00 03', icon: '🏬' },
    { name: 'JMARK Campus', zone: 'Lemba', address: 'Centre universitaire, Kinshasa', hours: 'Lun – Dim : 9h00 – 20h00', phone: '+243 81 000 00 04', icon: '🏫' }
  ];

  /* ---------- Contact ---------- */
  var CONTACT = {
    phone: '+243 81 000 00 00',
    whatsapp: '+243 81 000 00 00',
    email: 'contact@jmark.cd',
    address: 'Avenue du Commerce n° 45, Gombe, Kinshasa',
    hours: 'Lun – Dim : 8h00 – 21h00'
  };

  /* ---------- Utilitaires ---------- */
  function format(n) {
    n = Math.round(Number(n) || 0);
    var s = String(n);
    var out = '';
    var c = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s[i] + out;
      c++;
      if (c % 3 === 0 && i > 0) out = ' ' + out;
    }
    return out;
  }

  function money(n) {
    return format(n) + ' FC';
  }

  function getProduct(id) {
    id = parseInt(id, 10);
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return PRODUCTS[0];
  }

  function getCategory(key) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].key === key) return CATEGORIES[i];
    }
    return null;
  }

  function getPayment(id) {
    for (var i = 0; i < PAYMENTS.length; i++) {
      if (PAYMENTS[i].id === id) return PAYMENTS[i];
    }
    return PAYMENTS[0];
  }

  function productsByCategory(key) {
    return PRODUCTS.filter(function (p) { return p.category === key; });
  }

  function discountedProducts() {
    return PRODUCTS.filter(function (p) { return p.discount > 0; });
  }

  function newProducts() {
    return PRODUCTS.filter(function (p) { return p.badge === 'Nouveau'; });
  }

  function searchProducts(q) {
    q = String(q || '').trim().toLowerCase();
    if (!q) return PRODUCTS.slice();
    return PRODUCTS.filter(function (p) {
      return (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().indexOf(q) !== -1;
    });
  }

  return {
    shipping: SHIPPING,
    freeShippingAbove: FREE_SHIPPING_ABOVE,
    categories: CATEGORIES,
    products: PRODUCTS,
    banners: BANNERS,
    payments: PAYMENTS,
    stores: STORES,
    contact: CONTACT,
    format: format,
    money: money,
    getProduct: getProduct,
    getCategory: getCategory,
    getPayment: getPayment,
    productsByCategory: productsByCategory,
    discountedProducts: discountedProducts,
    newProducts: newProducts,
    searchProducts: searchProducts
  };
})();