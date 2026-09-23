/* ============================================
   JMARK — Logique des pages
   ============================================ */

(function () {
  'use strict';

  var C = window.JMARKCart;
  var D = window.JMARK;

  var CUST_KEY = 'jmark_customer';
  var ORDER_KEY = 'jmark_last_order';

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function readLS(key) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }
  function params() { return new URLSearchParams(location.search); }

  function setActiveNav() {
    var page = document.body.getAttribute('data-page');
    $all('[data-nav]').forEach(function (a) {
      a.classList.remove('is-active');
      if (a.getAttribute('data-nav') === page) a.classList.add('is-active');
    });
    var bn = document.querySelector('[data-bn="' + page + '"]');
    if (bn) $all('.bn-item').forEach(function (b) { b.classList.remove('is-active'); bn.classList.add('is-active'); });
  }

  /* ============================================
     ACCUEIL
     ============================================ */
  function initHome() {
    setActiveNav();

    /* ---------- Hero slider ---------- */
    var hero = $('#hero');
    if (hero) {
      var slidesWrap = $('#heroSlides');
      var dotsWrap = $('#heroDots');
      var html = '';
      var dots = '';
      D.banners.forEach(function (b, i) {
        html +=
          '<div class="hero-slide' + (i === 0 ? ' is-active' : '') + '" data-slide="' + i + '">' +
            '<div class="hero-bg" style="background-image:url(' + b.image + ')"></div>' +
            '<div class="hero-shade"></div>' +
            '<div class="container"><div class="hero-content">' +
              '<h1>' + esc(b.title) + '</h1>' +
              '<p class="hero-sub">' + esc(b.subtitle) + '</p>' +
              '<a class="btn btn-primary btn-lg hero-cta" href="' + esc(b.link) + '">' + esc(b.cta) + '</a>' +
            '</div></div>' +
          '</div>';
        dots += '<button type="button" class="hero-dot' + (i === 0 ? ' is-active' : '') + '" data-goto="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
      });
      slidesWrap.innerHTML = html;
      if (dotsWrap) dotsWrap.innerHTML = dots;

      var slides = $all('.hero-slide', hero);
      var dotEls = $all('.hero-dot', hero);
      var current = 0;
      var timer = null;

      function goTo(i) {
        if (i < 0) i = slides.length - 1;
        if (i >= slides.length) i = 0;
        current = i;
        slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
        dotEls.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      }
      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }
      function startAuto() {
        clearInterval(timer);
        timer = setInterval(next, 5200);
      }

      $('.hero-arrow.next', hero).addEventListener('click', function () { next(); startAuto(); });
      $('.hero-arrow.prev', hero).addEventListener('click', function () { prev(); startAuto(); });
      if (dotsWrap) dotsWrap.addEventListener('click', function (e) {
        var d = e.target.closest('[data-goto]');
        if (!d) return;
        goTo(parseInt(d.getAttribute('data-goto'), 10));
        startAuto();
      });
      startAuto();
    }

    /* ---------- Catégories ---------- */
    var catGrid = $('#homeCategories');
    if (catGrid) {
      var catHtml = '';
      D.categories.forEach(function (c) {
        var n = D.productsByCategory(c.key).length;
        catHtml +=
          '<a class="category-card" href="products.html?category=' + encodeURIComponent(c.key) + '" style="--cat:' + c.color + '">' +
            '<div class="category-card-media"><img src="' + c.image + '" alt="' + esc(c.key) + '" loading="lazy"></div>' +
            '<span class="category-card-emoji">' + c.emoji + '</span>' +
            '<span class="category-card-name">' + esc(c.key) + '</span>' +
            '<span class="category-card-count">' + n + ' produits</span>' +
          '</a>';
      });
      catGrid.innerHTML = catHtml;
    }

    /* ---------- Promotions ---------- */
    var promoGrid = $('#homePromos');
    if (promoGrid) C.renderGrid(promoGrid, D.discountedProducts().slice(0, 8));

    /* ---------- Nouveautés ---------- */
    var newGrid = $('#homeNew');
    if (newGrid) C.renderGrid(newGrid, D.newProducts().length ? D.newProducts().slice(0, 4) : D.products.slice(0, 4));
  }

  /* ============================================
     CATALOGUE
     ============================================ */
  function initProducts() {
    setActiveNav();
    var grid = $('#productGrid');
    if (!grid) return;

    var search = $('#filterSearch');
    var catSel = $('#catSelect');
    var priceSel = $('#priceSelect');
    var sortSel = $('#sortSelect');
    var promoOnly = $('#promoOnly');
    var resetBtn = $('#filterReset');
    var countEl = $('#resultCount');
    var emptyEl = $('#emptyState');

    var state = { q: '', category: 'all', price: 'all', sort: 'default', promo: false, newOnly: false };

    // URL params
    var p = params();
    if (p.get('q')) state.q = p.get('q');
    if (p.get('category')) state.category = p.get('category');
    if (p.get('cat') === 'nouveautes') state.newOnly = true;

    // Fill category select
    var catHtml = '<option value="all">Toutes les catégories</option>';
    D.categories.forEach(function (c) {
      catHtml += '<option value="' + esc(c.key) + '"' + (state.category === c.key ? ' selected' : '') + '>' + esc(c.key) + '</option>';
    });
    if (catSel) catSel.innerHTML = catHtml;
    if (search) search.value = state.q;

    function applyFilters() {
      var q = (search ? search.value : '') || state.q;
      var list = D.products.slice();
      list = D.searchProducts(q);

      if (state.category !== 'all') {
        list = list.filter(function (x) { return x.category === state.category; });
      }
      if (state.promo) {
        list = list.filter(function (x) { return x.discount > 0; });
      }
      if (state.newOnly) {
        list = list.filter(function (x) { return x.badge === 'Nouveau'; });
      }
      if (state.price !== 'all') {
        list = list.filter(function (x) {
          switch (state.price) {
            case 'lt5000': return x.price < 5000;
            case '5to10': return x.price >= 5000 && x.price < 10000;
            case '10to25': return x.price >= 10000 && x.price < 25000;
            case 'gt25': return x.price >= 25000;
            default: return true;
          }
        });
      }
      switch (state.sort) {
        case 'price-asc': list.sort(function (a, b) { return a.price - b.price; }); break;
        case 'price-desc': list.sort(function (a, b) { return b.price - a.price; }); break;
        case 'discount': list.sort(function (a, b) { return (b.discount || 0) - (a.discount || 0); }); break;
      }

      if (list.length === 0) {
        grid.innerHTML = '';
        grid.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
      } else {
        grid.style.display = 'grid';
        if (emptyEl) emptyEl.style.display = 'none';
        C.renderGrid(grid, list);
      }
      if (countEl) countEl.textContent = list.length + ' produit' + (list.length > 1 ? 's' : '') + ' trouvé' + (list.length > 1 ? 's' : '');
    }

    function syncURL() {
      try {
        var sp = new URLSearchParams();
        var q = (search ? search.value : '').trim() || state.q;
        if (q) sp.set('q', q);
        if (state.category !== 'all') sp.set('category', state.category);
        if (state.newOnly) sp.set('cat', 'nouveautes');
        var qs = sp.toString();
        history.replaceState(null, '', 'products.html' + (qs ? '?' + qs : ''));
      } catch (err) { /* file:// etc. */ }
    }

    function onApply() { applyFilters(); syncURL(); }

    if (search) search.addEventListener('input', function () { state.q = search.value.trim(); applyFilters(); syncURL(); });
    if (catSel) catSel.addEventListener('change', function () { state.category = catSel.value; applyFilters(); syncURL(); });
    if (priceSel) priceSel.addEventListener('change', function () { state.price = priceSel.value; applyFilters(); });
    if (sortSel) sortSel.addEventListener('change', function () { state.sort = sortSel.value; applyFilters(); });
    if (promoOnly) promoOnly.addEventListener('change', function () { state.promo = promoOnly.checked; applyFilters(); });

    function doReset() {
      state = { q: '', category: 'all', price: 'all', sort: 'default', promo: false, newOnly: false };
      if (search) search.value = '';
      if (catSel) catSel.value = 'all';
      if (priceSel) priceSel.value = 'all';
      if (sortSel) sortSel.value = 'default';
      if (promoOnly) promoOnly.checked = false;
      applyFilters();
      syncURL();
    }
    if (resetBtn) resetBtn.addEventListener('click', doReset);
    var emptyReset = $('#emptyReset');
    if (emptyReset) emptyReset.addEventListener('click', doReset);

    applyFilters();
  }

  /* ============================================
     DÉTAIL PRODUIT
     ============================================ */
  function initProduct() {
    setActiveNav();
    var media = $('#pdMedia');
    if (!media) return;

    var id = parseInt(params().get('id'), 10) || D.products[0].id;
    var p = D.getProduct(id);
    var cat = D.getCategory(p.category);

    var badge = '';
    if (p.discount > 0) badge += '<span class="discount-pill">−' + p.discount + '%</span>';
    if (p.badge) badge += '<span class="product-badge is-new">' + esc(p.badge) + '</span>';
    media.innerHTML = badge + '<img src="' + p.image + '" alt="' + esc(p.name) + '">';

    $('#pdCat').innerHTML = (cat ? cat.emoji + ' ' : '') + esc(p.category);
    $('#pdName').textContent = p.name;
    $('#pdPrice').textContent = D.money(p.price);
    if ($('#pdOld')) {
      $('#pdOld').textContent = p.oldPrice > p.price ? D.money(p.oldPrice) : '';
      $('#pdOld').style.display = p.oldPrice > p.price ? 'inline' : 'none';
    }
    $('#pdUnit').textContent = 'Prix unitaire : ' + esc(p.unit || '');
    $('#pdDesc').textContent = p.description;

    var stock = $('#pdStock');
    if (stock) {
      stock.innerHTML = p.available
        ? '<span class="stock-badge is-in"><span class="dot"></span> En stock</span>'
        : '<span class="stock-badge is-out"><span class="dot"></span> Rupture de stock</span>';
    }

    if ($('#pdBread')) $('#pdBread').textContent = p.category;

    var qtyInput = $('#pdQty');
    if ($('#pdMinus')) $('#pdMinus').addEventListener('click', function () {
      var v = parseInt(qtyInput.value, 10) || 1;
      if (v > 1) qtyInput.value = v - 1;
    });
    if ($('#pdPlus')) $('#pdPlus').addEventListener('click', function () {
      var v = parseInt(qtyInput.value, 10) || 1;
      if (v < 99) qtyInput.value = v + 1;
    });
    qtyInput.addEventListener('input', function () {
      var v = parseInt(qtyInput.value, 10);
      if (isNaN(v) || v < 1) qtyInput.value = 1;
      if (v > 99) qtyInput.value = 99;
    });

    var addBtn = $('#pdAdd');
    if (addBtn) addBtn.addEventListener('click', function () {
      var qty = parseInt(qtyInput.value, 10) || 1;
      C.add(p.id, qty);
      C.toast(qty + ' × ' + p.name + ' ajouté au panier');
    });

    var rel = $('#relatedGrid');
    if (rel) {
      var same = D.productsByCategory(p.category).filter(function (x) { return x.id !== p.id; });
      var others = D.products.filter(function (x) { return x.id !== p.id; });
      var picks = same.concat(others.filter(function (x) { return same.indexOf(x) === -1; })).slice(0, 4);
      C.renderGrid(rel, picks);
    }
  }

  /* ============================================
     PANIER
     ============================================ */
  function initCart() {
    setActiveNav();
    var list = $('#cartList');
    if (!list) return;
    var empty = $('#cartEmpty');
    var content = $('#cartContent');
    var summary = $('#cartSummary');

    function render() {
      var cart = C.read();
      if (cart.length === 0) {
        empty.style.display = 'flex';
        content.style.display = 'none';
        summary.style.display = 'none';
        return;
      }
      empty.style.display = 'none';
      content.style.display = 'block';
      summary.style.display = 'block';

      var html = '';
      for (var i = 0; i < cart.length; i++) {
        var p = D.getProduct(cart[i].id);
        html +=
          '<div class="cart-item" data-line="' + p.id + '">' +
            '<a class="cart-item-thumb" href="product.html?id=' + p.id + '">' +
              '<img src="' + p.image + '" alt="' + esc(p.name) + '">' +
            '</a>' +
            '<div class="cart-item-main">' +
              '<a class="cart-item-name" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
              '<div class="cart-item-price">' + D.money(p.price) + ' / ' + esc(p.unit || 'unité') + '</div>' +
              '<div class="cart-item-controls">' +
                '<div class="qty">' +
                  '<button type="button" data-dec aria-label="Diminuer">&minus;</button>' +
                  '<input type="text" inputmode="numeric" value="' + cart[i].qty + '" data-qty-input aria-label="Quantité">' +
                  '<button type="button" data-inc aria-label="Augmenter">+</button>' +
                '</div>' +
                '<button type="button" class="remove-btn" data-remove>Retirer</button>' +
              '</div>' +
            '</div>' +
            '<div class="cart-item-total">' + D.money(C.lineTotal(cart[i])) + '</div>' +
          '</div>';
      }
      list.innerHTML = html;

      $('#cartSubtotal').textContent = D.money(C.subtotal());
      var ship = C.shipping();
      $('#cartShipping').innerHTML = ship === 0 ? '<span class="badge-free">Offerte</span>' : D.money(ship);
      $('#cartTotal').textContent = D.money(C.total());
      var freeInfo = $('#cartFreeInfo');
      if (freeInfo) {
        if (D.freeShippingAbove - C.subtotal() > 0) {
          freeInfo.innerHTML = 'Plus que <strong>' + D.money(D.freeShippingAbove - C.subtotal()) + '</strong> pour la livraison offerte';
        } else {
          freeInfo.innerHTML = '<span class="ok">✓ Livraison offerte !</span>';
        }
      }
    }

    list.addEventListener('click', function (e) {
      var row = e.target.closest('.cart-item');
      if (!row) return;
      var id = row.getAttribute('data-line');
      var input = $('[data-qty-input]', row);
      var v = parseInt(input ? input.value : 1, 10) || 1;
      if (e.target.closest('[data-inc]')) { C.updateQty(id, v + 1); }
      else if (e.target.closest('[data-dec]')) { C.updateQty(id, v - 1); }
      else if (e.target.closest('[data-remove]')) { C.remove(id); C.toast('Produit retiré du panier'); }
      render();
    });

    list.addEventListener('input', function (e) {
      if (!e.target.matches('[data-qty-input]')) return;
      var row = e.target.closest('.cart-item');
      var v = parseInt(e.target.value, 10);
      if (isNaN(v)) return;
      if (v < 1) v = 1;
      if (v > 99) v = 99;
      e.target.value = v;
      C.updateQty(row.getAttribute('data-line'), v);
      render();
    });

    render();
  }

  /* ============================================
     CHECKOUT
     ============================================ */
  function initCheckout() {
    setActiveNav();
    var form = $('#checkoutForm');
    if (!form) return;

    if (C.count() === 0) {
      var empty = $('#checkoutEmpty');
      var content = $('#checkoutContentWrap');
      if (empty) empty.style.display = 'flex';
      if (content) content.style.display = 'none';
      return;
    }

    var customer = readLS(CUST_KEY) || {};
    ['fullName', 'phone', 'address', 'city', 'email'].forEach(function (f) {
      var el = document.getElementById('co_' + f);
      if (el && customer[f]) el.value = customer[f];
    });

    if ($('#sumItems')) $('#sumItems').innerHTML = C.miniItemsHTML(C.read());
    if ($('#sumLines')) $('#sumLines').innerHTML = C.totalsHTML(C.read());
    if ($('#co_total')) $('#co_total').textContent = D.money(C.total());

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;
      $all('.field', form).forEach(function (f) { f.classList.remove('has-error'); });

      var checks = [
        { id: 'co_fullName', req: true, msg: 'Veuillez saisir votre nom complet.' },
        { id: 'co_phone', req: true, msg: 'Veuillez saisir votre numéro de téléphone.' },
        { id: 'co_address', req: true, msg: 'Veuillez saisir votre adresse de livraison.' },
        { id: 'co_city', req: true, msg: 'Veuillez saisir votre ville.' },
        { id: 'co_email', req: false, msg: 'Veuillez saisir un email valide.' }
      ];
      checks.forEach(function (chk) {
        var el = document.getElementById(chk.id);
        if (!el) return;
        var val = el.value.trim();
        var bad = false;
        if (chk.req && !val) bad = true;
        if (!bad && chk.id === 'co_email' && val && !/^\S+@\S+\.\S+$/.test(val)) bad = true;
        if (bad) {
          var field = el.closest('.field');
          field.classList.add('has-error');
          var err = $('.error', field);
          if (err) err.textContent = chk.msg;
          if (!firstInvalid) firstInvalid = field;
          valid = false;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.querySelector('input, select').focus();
        C.toast('Veuillez compléter les champs requis', { noLink: true });
        return;
      }

      writeLS(CUST_KEY, {
        fullName: document.getElementById('co_fullName').value.trim(),
        phone: document.getElementById('co_phone').value.trim(),
        address: document.getElementById('co_address').value.trim(),
        city: document.getElementById('co_city').value.trim(),
        email: document.getElementById('co_email').value.trim(),
        instructions: document.getElementById('co_instructions') ? document.getElementById('co_instructions').value.trim() : ''
      });
      location.href = 'payment.html';
    });
  }

  /* ============================================
     PAIEMENT
     ============================================ */
  function initPayment() {
    setActiveNav();
    var wrap = $('#paymentContent');
    if (!wrap) return;

    if (C.count() === 0) {
      var empty = $('#paymentEmpty');
      var content = $('#paymentContent');
      if (empty) empty.style.display = 'flex';
      if (content) content.style.display = 'none';
      return;
    }

    if ($('#sumItemsP')) $('#sumItemsP').innerHTML = C.miniItemsHTML(C.read());
    if ($('#sumLinesP')) $('#sumLinesP').innerHTML = C.totalsHTML(C.read());
    if ($('#co_totalP')) $('#co_totalP').textContent = D.money(C.total());

    var optsWrap = $('#payOptions');
    var html = '';
    D.payments.forEach(function (pm, i) {
      html +=
        '<button type="button" class="pay-card" data-pay="' + pm.id + '"' + (i === 0 ? ' data-default' : '') + '>' +
          '<span class="pay-logo" style="background:' + pm.color + '">' + esc(pm.initials) + '</span>' +
          '<span class="pay-info">' +
            '<span class="pay-name">' + esc(pm.label) + '</span>' +
            '<span class="pay-desc">' + esc(pm.desc) + '</span>' +
          '</span>' +
          '<span class="pay-check">' + C.icon('check') + '</span>' +
        '</button>';
    });
    optsWrap.innerHTML = html;

    var selected = optsWrap.querySelector('[data-default]').getAttribute('data-pay');
    optsWrap.querySelector('[data-default]').classList.add('is-selected');

    optsWrap.addEventListener('click', function (e) {
      var opt = e.target.closest('.pay-card');
      if (!opt) return;
      selected = opt.getAttribute('data-pay');
      $all('.pay-card', optsWrap).forEach(function (o) { o.classList.remove('is-selected'); });
      opt.classList.add('is-selected');
    });

    var confirmBtn = $('#payConfirm');
    var simPanel = $('#simPanel');
    var busy = false;

    function phoneLabel() {
      var c = readLS(CUST_KEY) || {};
      return c.phone || '+243 XXX XXX XXX';
    }

    confirmBtn.addEventListener('click', function () {
      if (!selected) {
        C.toast('Veuillez sélectionner un moyen de paiement', { noLink: true });
        return;
      }
      if (busy) return;
      busy = true;
      var method = D.getPayment(selected);

      simPanel.classList.add('is-visible');
      simPanel.innerHTML =
        '<div class="processing">' +
          '<div class="spinner"></div>' +
          '<h3>Traitement de votre paiement...</h3>' +
          '<p>' + esc(method.label) + (method.id === 'cod' ? '' : ' • ' + esc(phoneLabel())) + '</p>' +
          '<p class="sim-note">Simulation de démonstration — aucun débit réel n’est effectué.</p>' +
        '</div>';
      simPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(function () {
        simPanel.innerHTML =
          '<div class="success-state">' +
            '<div class="check-circle">' + C.icon('check') + '</div>' +
            '<h3>Paiement simulé avec succès</h3>' +
            '<p>Préparation de votre commande...</p>' +
          '</div>';
        setTimeout(function () {
          finishOrder(method.id);
        }, 1600);
      }, 2300);
    });
  }

  function orderNumber() {
    return '#JMK-2026-' + String(Math.floor(1000 + Math.random() * 9000));
  }

  function finishOrder(paymentId) {
    var cart = C.read();
    var customer = readLS(CUST_KEY) || {};
    var method = D.getPayment(paymentId);
    var sub = C.subtotal();
    var ship = C.shipping();

    var order = {
      number: orderNumber(),
      date: new Date().toISOString(),
      items: cart.map(function (l) {
        var p = D.getProduct(l.id);
        return { id: p.id, name: p.name, image: p.image, price: p.price, qty: l.qty };
      }),
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
      payment: { id: method.id, label: method.label },
      customer: {
        fullName: customer.fullName || 'Client JMARK',
        phone: customer.phone || '+243 XXX XXX XXX',
        address: customer.address || '—',
        city: customer.city || '—',
        email: customer.email || ''
      }
    };
    writeLS(ORDER_KEY, order);
    C.clear();
    location.href = 'confirmation.html';
  }

  /* ============================================
     CONFIRMATION
     ============================================ */
  function initConfirmation() {
    setActiveNav();
    var order = readLS(ORDER_KEY);
    var ok = $('#confirmContent');
    var miss = $('#confirmMissing');

    if (!order || !order.items || order.items.length === 0) {
      if (ok) ok.style.display = 'none';
      if (miss) miss.style.display = 'flex';
      return;
    }
    if (miss) miss.style.display = 'none';
    if (ok) ok.style.display = 'block';

    $('#orderNum').textContent = order.number;
    var d = new Date(order.date);
    $('#orderDate').textContent = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) +
      ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    var items = $('#confirmItems');
    var html = '';
    order.items.forEach(function (it) {
      html +=
        '<div class="co-item">' +
          '<img src="' + it.image + '" alt="' + esc(it.name) + '">' +
          '<div class="co-item-main"><a href="product.html?id=' + it.id + '"><strong>' + esc(it.name) + '</strong></a>' +
            '<span>' + it.qty + ' × ' + D.money(it.price) + '</span></div>' +
          '<div class="co-item-total">' + D.money(it.price * it.qty) + '</div>' +
        '</div>';
    });
    items.innerHTML = html;

    $('#confirmSubtotal').textContent = D.money(order.subtotal);
    $('#confirmShipping').textContent = order.shipping === 0 ? 'Offerte' : D.money(order.shipping);
    $('#confirmTotal').textContent = D.money(order.total);
    $('#confirmPay').textContent = order.payment.label;

    $('#confName').textContent = order.customer.fullName;
    $('#confPhone').textContent = order.customer.phone;
    $('#confAddress').textContent = order.customer.address;
    $('#confCity').textContent = order.customer.city + (order.customer.email ? ' • ' + order.customer.email : '');
  }

  /* ============================================
     COMPTE (démo)
     ============================================ */
  function initAccount() {
    setActiveNav();
    var form = $('#accountForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        C.toast('Fonctionnalité disponible prochainement.', { noLink: true });
      });
    }
    var signup = $('#accountSignupBtn');
    if (signup) {
      signup.addEventListener('click', function (e) {
        e.preventDefault();
        C.toast('La création de compte sera bientôt disponible.', { noLink: true });
      });
    }
  }

  /* ============================================
     PROMOTIONS
     ============================================ */
  function initPromotions() {
    setActiveNav();
    var grid = $('#promoGrid');
    if (grid) C.renderGrid(grid, D.discountedProducts());
    var count = $('#promoCount');
    if (count) count.textContent = D.discountedProducts().length + ' promotions en cours';
  }

  /* ============================================
     NOS MAGASINS
     ============================================ */
  function initStores() {
    setActiveNav();
    var grid = $('#storesGrid');
    if (grid) {
      var html = '';
      D.stores.forEach(function (s) {
        html +=
          '<div class="store-card">' +
            '<div class="store-head"><span class="store-icon">' + s.icon + '</span>' +
              '<div><h3>' + esc(s.name) + '</h3><span class="store-zone">' + esc(s.zone) + '</span></div></div>' +
            '<p class="store-address">' + C.icon('pin') + esc(s.address) + '</p>' +
            '<p class="store-hours">' + C.icon('box') + esc(s.hours) + '</p>' +
            '<a class="store-phone" href="tel:' + esc(s.phone) + '">' + C.icon('phone') + esc(s.phone) + '</a>' +
          '</div>';
      });
      grid.innerHTML = html;
    }
  }

  /* ============================================
     CONTACT
     ============================================ */
  function initContact() {
    setActiveNav();
    var phoneEl = $('#ctPhone');
    var waEl = $('#ctWhatsapp');
    var mailEl = $('#ctEmail');
    var addrEl = $('#ctAddress');
    if (phoneEl) phoneEl.textContent = D.contact.phone;
    if (waEl) waEl.textContent = D.contact.whatsapp;
    if (mailEl) mailEl.textContent = D.contact.email;
    if (addrEl) addrEl.textContent = D.contact.address;

    var form = $('#contactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        C.toast('Message envoyé (démonstration). Merci !', { noLink: true });
        form.reset();
      });
    }
  }

  /* ============================================
     MESSAGES PARTAGÉS (maquette header etc.)
     ============================================ */
  function bindGeneric() {
    document.addEventListener('click', function (e) {
      var d = e.target.closest('[data-notify]');
      if (d) {
        e.preventDefault();
        C.toast(d.getAttribute('data-notify') || 'Fonctionnalité disponible prochainement.', { noLink: true });
      }
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    C.initHeader();
    bindGeneric();
    var p = document.body.getAttribute('data-page');
    if (p === 'home') initHome();
    else if (p === 'products') initProducts();
    else if (p === 'product') initProduct();
    else if (p === 'cart') initCart();
    else if (p === 'checkout') initCheckout();
    else if (p === 'payment') initPayment();
    else if (p === 'confirmation') initConfirmation();
    else if (p === 'account') initAccount();
    else if (p === 'promotions') initPromotions();
    else if (p === 'stores') initStores();
    else if (p === 'contact') initContact();
    else setActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();