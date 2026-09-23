/* ============================================
   JMARK — Panier (état local) + UI partagée
   ============================================ */

(function () {
  'use strict';

  var KEY = 'jmark_cart';
  var D = window.JMARK;

  var I = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 3h15v13H1z"></path><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>'
  };

  function icon(name) { return I[name] || ''; }

  /* ---------- Panier (localStorage) ---------- */
  function readCart() {
    try {
      var raw = localStorage.getItem(KEY);
      var cart = raw ? JSON.parse(raw) : [];
      return Array.isArray(cart) ? cart : [];
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
    refreshBadges();
    var drawer = document.getElementById('cartDrawer');
    if (drawer && drawer.classList.contains('is-open')) renderDrawer();
  }

  function addToCart(id, qty) {
    id = parseInt(id, 10);
    qty = qty || 1;
    var cart = readCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { cart[i].qty += qty; found = true; break; }
    }
    if (!found) cart.push({ id: id, qty: qty });
    saveCart(cart);
    return cart;
  }

  function updateQty(id, qty) {
    var cart = readCart();
    qty = parseInt(qty, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === parseInt(id, 10)) { cart[i].qty = qty; found = true; break; }
    }
    if (!found) cart.push({ id: parseInt(id, 10), qty: qty });
    saveCart(cart);
    return cart;
  }

  function removeFromCart(id) {
    id = parseInt(id, 10);
    var cart = readCart().filter(function (l) { return l.id !== id; });
    saveCart(cart);
    return cart;
  }

  function clearCart() { saveCart([]); }

  function count() {
    var c = readCart(), n = 0;
    for (var i = 0; i < c.length; i++) n += c[i].qty;
    return n;
  }

  function lineTotal(line) {
    var p = D.getProduct(line.id);
    return p.price * line.qty;
  }

  function subtotal() {
    var c = readCart(), s = 0;
    for (var i = 0; i < c.length; i++) s += lineTotal(c[i]);
    return s;
  }

  function shipping() {
    var s = subtotal();
    if (s === 0) return 0;
    return s >= D.freeShippingAbove ? 0 : D.shipping;
  }

  function total() {
    return subtotal() + shipping();
  }

  /* ---------- Badges compteur ---------- */
  function refreshBadges() {
    var n = count();
    var els = document.querySelectorAll('[data-cart-count]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var total = el.getAttribute('data-cart-count') === 'total';
      el.textContent = total ? D.money(total()) : n;
      if (total) el.classList.remove('is-hidden');
      else if (n > 0) el.classList.remove('is-hidden');
      else el.classList.add('is-hidden');
    }
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;

  function toast(message, opts) {
    opts = opts || {};
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    var link = '';
    if (!opts.noLink) link = '<a href="' + (opts.link || 'cart.html') + '" class="toast-go">' + (opts.linkLabel || 'Voir le panier') + '</a>';
    el.innerHTML = icon('check') + '<span>' + message + '</span>' + link;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('is-visible');
      setTimeout(function () { el.remove(); }, 300);
    }, 2800);
  }

  /* ---------- Carte produit ---------- */
  function badgeHTML(p) {
    var html = '';
    if (p.discount > 0) {
      html += '<span class="discount-pill">−' + p.discount + '%</span>';
    }
    if (p.badge) {
      html += '<span class="product-badge ' + (p.badge === 'Nouveau' ? 'is-new' : '') + '">' + p.badge + '</span>';
    }
    return html;
  }

  function cardHTML(p) {
    var cat = D.getCategory(p.category);
    return '' +
      '<article class="product-card">' +
        '<a class="product-card-media" href="product.html?id=' + p.id + '">' +
          badgeHTML(p) +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
          '<span class="quick-view">Voir</span>' +
        '</a>' +
        '<div class="product-card-body">' +
          '<div class="product-card-cat">' + (cat ? cat.emoji + ' ' : '') + p.category + '</div>' +
          '<a class="product-card-name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
          '<div class="product-card-price">' +
            '<span class="price-now">' + D.money(p.price) + '</span>' +
            (p.oldPrice > p.price ? '<span class="price-old">' + D.money(p.oldPrice) + '</span>' : '') +
          '</div>' +
          '<button type="button" class="btn btn-primary btn-block btn-card-add" data-add-to-cart="' + p.id + '">' +
            icon('cart') + '<span>Ajouter au panier</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  function renderGrid(container, products) {
    var html = '';
    for (var i = 0; i < products.length; i++) html += cardHTML(products[i]);
    container.innerHTML = html;
  }

  /* ---------- Petit résumé de panier (drawer / résumés) ---------- */
  function miniItemsHTML(cart) {
    var html = '';
    for (var i = 0; i < cart.length; i++) {
      var p = D.getProduct(cart[i].id);
      html +=
        '<li>' +
          '<span>' + p.name + ' <strong>× ' + cart[i].qty + '</strong></span>' +
          '<span>' + D.money(lineTotal(cart[i])) + '</span>' +
        '</li>';
    }
    return html;
  }

  function totalsHTML(cart) {
    var sub = subtotal();
    var ship = shipping();
    var shipLabel = ship === 0 ? '<span class="badge-free">Offerte</span>' : D.money(ship);
    return '' +
      '<li><span>Sous-total</span><span>' + D.money(sub) + '</span></li>' +
      '<li><span>Livraison</span><span>' + (sub > 0 ? shipLabel : D.money(0)) + '</span></li>' +
      '<li class="grand"><span>TOTAL</span><span>' + D.money(sub + ship) + '</span></li>';
  }

  /* ---------- Cart drawer ---------- */
  function openDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('drawerOverlay');
    if (!drawer) return;
    renderDrawer();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('drawerOverlay');
    if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
    if (overlay) overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function renderDrawer() {
    var drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    var items = document.getElementById('drawerItems');
    var empty = document.getElementById('drawerEmpty');
    var foot = document.getElementById('drawerFoot');
    var sub = document.getElementById('drawerSub');
    var totalEl = document.getElementById('drawerTotal');
    var headCount = document.getElementById('drawerHeadCount');

    var cart = readCart();
    if (headCount) headCount.textContent = count() > 0 ? '(' + count() + ')' : '';

    if (!items || !empty || !foot) return;
    if (cart.length === 0) {
      items.innerHTML = '';
      items.style.display = 'none';
      empty.style.display = 'block';
      foot.style.display = 'none';
      return;
    }
    items.style.display = 'flex';
    empty.style.display = 'none';
    foot.style.display = 'block';

    var html = '';
    for (var i = 0; i < cart.length; i++) {
      var p = D.getProduct(cart[i].id);
      html +=
        '<div class="drawer-item">' +
          '<a class="drawer-thumb" href="product.html?id=' + p.id + '"><img src="' + p.image + '" alt="' + p.name + '"></a>' +
          '<div class="drawer-main">' +
            '<a class="drawer-name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
            '<div class="drawer-meta">' + D.money(p.price) + ' / ' + p.unit + '</div>' +
            '<div class="drawer-controls">' +
              '<div class="qty qty-sm">' +
                '<button type="button" data-dec aria-label="Diminuer">&minus;</button>' +
                '<input type="text" inputmode="numeric" value="' + cart[i].qty + '" data-qty-input aria-label="Quantité">' +
                '<button type="button" data-inc aria-label="Augmenter">+</button>' +
              '</div>' +
              '<button type="button" class="drawer-remove" data-remove aria-label="Retirer">' + icon('x') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="drawer-total-line">' + D.money(lineTotal(cart[i])) + '</div>' +
        '</div>';
    }
    items.innerHTML = html;
    if (sub) sub.textContent = D.money(subtotal());
    if (totalEl) totalEl.textContent = D.money(total());
  }

  /* ---------- Header / navigation partagée ---------- */
  function initHeader() {
    var menuBtn = document.getElementById('menuBtn');
    var mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
      menuBtn.addEventListener('click', function () {
        var open = mainNav.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var catBtn = document.getElementById('catBtn');
    var catMenu = document.getElementById('catMenu');
    if (catBtn && catMenu) {
      catBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        catMenu.classList.toggle('is-open');
      });
      document.addEventListener('click', function (e) {
        if (catMenu.classList.contains('is-open') && !e.target.closest('#catMenu') && e.target !== catBtn) {
          catMenu.classList.remove('is-open');
        }
      });
      var catClose = document.getElementById('catMenuClose');
      if (catClose) catClose.addEventListener('click', function () { catMenu.classList.remove('is-open'); });
    }

    var cartOpen = document.getElementById('cartOpen');
    if (cartOpen) cartOpen.addEventListener('click', openDrawer);
    var bottomCart = document.getElementById('bottomCart');
    if (bottomCart) bottomCart.addEventListener('click', openDrawer);
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-drawer-close]')) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDrawer();
        if (catMenu) catMenu.classList.remove('is-open');
        if (mainNav) mainNav.classList.remove('is-open');
      }
    });

    var forms = document.querySelectorAll('[data-header-search]');
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener('submit', function (e) {
        e.preventDefault();
        var q = this.querySelector('input[type="search"], input[name="q"]');
        var val = (q ? q.value : '').trim();
        location.href = 'products.html' + (val ? '?q=' + encodeURIComponent(val) : '');
      });
    }

    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add-to-cart]');
      if (!add) return;
      e.preventDefault();
      var id = add.getAttribute('data-add-to-cart');
      addToCart(id, 1);
      var p = D.getProduct(id);
      toast(p.name + ' ajouté au panier');
      var btn = e.target.closest('.btn-card-add');
      if (btn && !btn.disabled) {
        btn.classList.add('is-added');
        setTimeout(function () { btn.classList.remove('is-added'); }, 900);
      }
    });

    var bottomSearch = document.getElementById('bottomSearch');
    if (bottomSearch) {
      bottomSearch.addEventListener('click', function () {
        if (document.body.getAttribute('data-page') === 'products') {
          var input = document.querySelector('[data-header-search] input[type="search"]');
          if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        } else {
          location.href = 'products.html';
        }
      });
    }

    /* ---------- Listes de catégories (menu) ---------- */
    function categoryItemsHTML() {
      var html = '';
      D.categories.forEach(function (c) {
        var n = D.productsByCategory(c.key).length;
        html +=
          '<a class="cat-menu-item" href="products.html?category=' + encodeURIComponent(c.key) + '">' +
            '<span class="cm-emoji">' + c.emoji + '</span>' +
            '<span>' + c.key + '<span class="cm-count">' + n + ' produits</span></span>' +
          '</a>';
      });
      return html;
    }
    var catMenuList = document.getElementById('catMenuList');
    if (catMenuList) catMenuList.innerHTML = categoryItemsHTML();
    var mobCats = document.getElementById('mobCats');
    if (mobCats) mobCats.innerHTML = categoryItemsHTML();

    refreshBadges();
  }

  /* ---------- Export ---------- */
  window.JMARKCart = {
    read: readCart,
    add: addToCart,
    updateQty: updateQty,
    remove: removeFromCart,
    clear: clearCart,
    count: count,
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    lineTotal: lineTotal,
    cardHTML: cardHTML,
    renderGrid: renderGrid,
    miniItemsHTML: miniItemsHTML,
    totalsHTML: totalsHTML,
    toast: toast,
    icon: icon,
    initHeader: initHeader,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    renderDrawer: renderDrawer,
    refreshBadges: refreshBadges
  };
})();