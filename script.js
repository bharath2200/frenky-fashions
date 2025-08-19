let products = [];
let cart = [];

// Fetch product data
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

// Display products
function displayProducts(items) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  items.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    list.appendChild(card);
  });
}

// Add to cart
function addToCart(index) {
  cart.push(products[index]);
  updateCartButton();
}

// Update cart button count
function updateCartButton() {
  document.getElementById("cart-button").innerText = `Cart (${cart.length})`;
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    const filtered = category === "all" ? products : products.filter(p => p.category === category);
    displayProducts(filtered);
  });
});

// Search bar
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  displayProducts(filtered);
});

// Sort dropdown
document.getElementById("sort").addEventListener("change", e => {
  const val = e.target.value;
  let sorted = [...products];
  if (val === "asc") sorted.sort((a, b) => a.price - b.price);
  if (val === "desc") sorted.sort((a, b) => b.price - a.price);
  displayProducts(sorted);
});

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Cart popup
document.getElementById("cart-button").addEventListener("click", showCart);

function showCart() {
  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";

  const popup = document.createElement("div");
  popup.className = "cart-popup";

  popup.innerHTML = `
    <h2>Your Cart</h2>
    ${cart.length === 0 ? "<p>Cart is empty</p>" : ""}
    ${cart.map((item, i) => `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `).join('')}
    <button id="close-cart">Close</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById("close-cart").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartButton();
  document.querySelector(".cart-overlay").remove();
  showCart(); // reopen updated cart
}
