let products = [];
let cart = [];

// Load products from JSON
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// Display products
function displayProducts(items) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  items.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    list.appendChild(card);
  });
}

// Add to cart
function addToCart(index) {
  cart.push(products[index]);
  document.getElementById('cart-count').textContent = cart.length;
}

// Cart popup
document.getElementById('cart-button').addEventListener('click', () => {
  showCart();
});

function showCart() {
  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  
  const popup = document.createElement('div');
  popup.className = 'cart-popup';

  popup.innerHTML = `
    <h2>Your Cart</h2>
    ${cart.length === 0 
      ? '<p>Cart is empty</p>'
      : cart.map((item, i) => `
          <div class="cart-item">
            <span>${item.name} - ₹${item.price}</span>
            <button onclick="removeFromCart(${i}); closeCartPopup()">Remove</button>
          </div>
        `).join('')
    }
    <button id="close-cart">Close</button>
  `;
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById('close-cart').addEventListener('click', closeCartPopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCartPopup();
  });
}

function closeCartPopup() {
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) document.body.removeChild(overlay);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  document.getElementById('cart-count').textContent = cart.length;
  closeCartPopup();
  showCart();
}

// Search and filter
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', filterProducts);

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    filterProducts();
  });
});

document.getElementById('sort').addEventListener('change', filterProducts);

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
  const sortValue = document.getElementById('sort').value;

  let filtered = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm)
  );

  if (sortValue === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}
