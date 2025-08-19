// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Global variables
let products = [];
let cart = [];

// Load products dynamically
async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
  displayProducts(products);
}

// Display products in grid
function displayProducts(list) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  list.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Add to cart
window.addToCart = function(index) {
  cart.push(products[index]);
  updateCartCount();
  alert(`${products[index].name} added to cart`);
};

function updateCartCount() {
  document.getElementById("cart-count").innerText = cart.length;
}

// Search functionality
document.getElementById("search-bar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
});

// Category filtering
document.getElementById("category-menu").addEventListener("click", (e) => {
  if (e.target.dataset.category) {
    e.preventDefault();
    const category = e.target.dataset.category;
    const filtered = category === "all" ? products : products.filter(p => p.category === category);
    displayProducts(filtered);
  }
});

// Cart popup handling
document.getElementById("cart-button").addEventListener("click", () => {
  const popup = document.getElementById("cart-popup");
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
  } else {
    cart.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.name} - ₹${item.price} 
                      <button onclick="removeFromCart(${i})">Remove</button>`;
      cartList.appendChild(li);
    });
  }

  popup.style.display = "block";
});

window.removeFromCart = function(i) {
  cart.splice(i, 1);
  updateCartCount();
  document.getElementById("cart-button").click(); // refresh popup
};

document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-popup").style.display = "none";
});

// Initial load
loadProducts();
