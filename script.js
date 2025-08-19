/* ----------------- STATE ----------------- */
let products = [];
let cart = [];

/* ----------------- INIT ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Theme
  const savedTheme = localStorage.getItem("ff_theme");
  if (savedTheme === "light") document.body.classList.replace("theme-dark", "theme-light");

  // Load products
  fetch("products.json")
    .then(r => r.json())
    .then(data => { products = data; renderProducts(products); restoreCart(); });

  // Header controls
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("cart-button").addEventListener("click", openCart);

  // Search (header)
  document.getElementById("site-search").addEventListener("input", () => filterAndRender());

  // Category filter
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterAndRender();
    });
  });

  // Sort
  document.getElementById("sort").addEventListener("change", filterAndRender);

  // Hero slider
  setupHeroSlider();
});

/* ----------------- THEME ----------------- */
function toggleTheme() {
  const isDark = document.body.classList.contains("theme-dark");
  document.body.classList.toggle("theme-dark", !isDark);
  document.body.classList.toggle("theme-light", isDark);
  localStorage.setItem("ff_theme", isDark ? "light" : "dark");
}

/* ----------------- PRODUCTS RENDER ----------------- */
function renderProducts(list) {
  const wrap = document.getElementById("product-list");
  wrap.innerHTML = "";
  list.forEach((p, idx) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button data-idx="${idx}" class="add-btn">Add to Cart</button>
    `;
    wrap.appendChild(card);
  });

  wrap.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.dataset.idx);
      addToCart(products[i]);
    });
  });
}

function filterAndRender() {
  const q = document.getElementById("site-search").value.trim().toLowerCase();
  const activeBtn = document.querySelector(".filter-btn.active");
  const category = activeBtn ? activeBtn.dataset.category : "all";
  const sort = document.getElementById("sort").value;

  let list = products.filter(p =>
    (category === "all" || p.category === category) &&
    (p.name.toLowerCase().includes(q))
  );

  if (sort === "asc") list.sort((a,b) => a.price - b.price);
  if (sort === "desc") list.sort((a,b) => b.price - a.price);

  renderProducts(list);
}

/* ----------------- CART ----------------- */
function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartCount();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  // Re-render cart if open
  const overlay = document.querySelector(".cart-overlay");
  if (overlay) { overlay.remove(); openCart(); }
}

function openCart() {
  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  const popup = document.createElement("div");
  popup.className = "cart-popup";
  popup.innerHTML = `
    <h2>Your Cart</h2>
    <div id="cart-lines">
      ${cart.length ? "" : "<p>Your cart is empty.</p>"}
      ${cart.map((c, i) => `
        <div class="cart-line">
          <span>${c.name}</span>
          <span>₹${c.price}</span>
          <button class="icon-btn" data-remove="${i}" title="Remove">✕</button>
        </div>
      `).join("")}
    </div>
    <div class="cart-actions">
      <button class="secondary" id="close-cart">Close</button>
      <button id="checkout">Checkout</button>
    </div>
  `;
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.querySelector("#close-cart").addEventListener("click", () => overlay.remove());
  popup.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", (e) => removeFromCart(Number(e.currentTarget.dataset.remove)));
  });
}

function saveCart() {
  localStorage.setItem("ff_cart", JSON.stringify(cart));
}
function restoreCart() {
  const stored = localStorage.getItem("ff_cart");
  if (stored) cart = JSON.parse(stored);
  updateCartCount();
}
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

/* ----------------- HERO SLIDER ----------------- */
function setupHeroSlider() {
  const slider = document.getElementById("hero-slider");
  const slides = [...slider.querySelectorAll(".slide")];
  const dotsWrap = document.getElementById("hero-dots");
  let i = 0, timer;

  function go(n) {
    slides[i].classList.remove("active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("active");
    updateDots();
    restart();
  }

  function next() { go(i + 1); }
  function prev() { go(i - 1); }

  function updateDots() {
    dotsWrap.innerHTML = slides.map((_, idx) =>
      `<button class="${idx===i?'active':''}" data-goto="${idx}" aria-label="Go to slide ${idx+1}"></button>`
    ).join("");
    dotsWrap.querySelectorAll("[data-goto]").forEach(b =>
      b.addEventListener("click", e => go(Number(e.currentTarget.dataset.goto)))
    );
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  slider.querySelector(".next").addEventListener("click", next);
  slider.querySelector(".prev").addEventListener("click", prev);

  updateDots();
  restart();
}
