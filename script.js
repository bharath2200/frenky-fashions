let products = [];
let cart = [];

// Load products from JSON
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
    loadCart();
  });

const productList = document.getElementById("product-list");
const searchBox = document.getElementById("search-box");
const sortSelect = document.getElementById("sort-products");

// Display products
function displayProducts(items) {
  productList.innerHTML = "";
  items.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

// Search filter
searchBox.addEventListener("input", () => {
  filterProducts();
});

// Category filter
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterProducts();
  });
});

// Sorting
sortSelect.addEventListener("change", () => {
  filterProducts();
});

function filterProducts() {
  const searchTerm = searchBox.value.toLowerCase();
  const category = document.querySelector(".filter-btn.active").dataset.category;
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) &&
    (category === "All" || p.category === category)
  );
  if (sortSelect.value === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }
  displayProducts(filtered);
}

// Cart functions
window.addToCart = function(index) {
  cart.push(products[index]);
  updateCartCount();
  saveCart();
};

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem("cart");
  if (stored) {
    cart = JSON.parse(stored);
    updateCartCount();
  }
}

// Cart popup
const cartButton = document.getElementById("cart-button");
const cartPopup = document.getElementById("cart-popup");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");

cartButton.addEventListener("click", () => {
  cartItems.innerHTML = "";
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeFromCart(i);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
  cartPopup.classList.remove("hidden");
});

closeCart.addEventListener("click", () => {
  cartPopup.classList.add("hidden");
});

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartCount();
  saveCart();
  document.getElementById("cart-button").click(); // refresh popup
};

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
