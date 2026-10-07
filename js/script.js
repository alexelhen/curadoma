let cart = [];

const catalogGrid = document.getElementById('catalog-grid');
const cartItemsBox = document.getElementById('cart-items');
const cartEmptyText = document.getElementById('cart-empty');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const cartSumEl = document.getElementById('cart-sum');
const openOrderBtn = document.getElementById('open-order-form');

const cartToggleBtn = document.getElementById('cart-toggle');
const cartSection = document.getElementById('cart-section');

const orderInputs = document.querySelectorAll('#order-form input');

function renderCatalog() {
  catalogGrid.innerHTML = '';

  products.forEach(function (product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML =
      '<img class="product-card__image" src="' + product.image + '" alt="' + product.name + '">' +
      '<h3 class="product-card__name">' + product.name + '</h3>' +
      '<p class="product-card__price">' + product.price + ' ₽/кг</p>' +
      '<button class="btn" data-id="' + product.id + '">Добавить в корзину</button>';

    catalogGrid.appendChild(card);
  });
}

function renderCart() {
  cartItemsBox.innerHTML = '';

  if (cart.length === 0) {
    cartItemsBox.appendChild(cartEmptyText);
    openOrderBtn.disabled = true;
  } else {
    openOrderBtn.disabled = false;

    cart.forEach(function (item) {
      const product = products.find(function (p) {
        return p.id === item.id;
      });

      const sum = product.price * item.quantity;

      const row = document.createElement('div');
      row.className = 'cart-item';

      row.innerHTML =
        '<span class="cart-item__name">' + product.name + '</span>' +
        '<div class="cart-item__controls">' +
          '<button class="qty-btn" data-action="decrease" data-id="' + product.id + '">-</button>' +
          '<span class="cart-item__qty">' + item.quantity + '</span>' +
          '<button class="qty-btn" data-action="increase" data-id="' + product.id + '">+</button>' +
        '</div>' +
        '<span class="cart-item__sum">' + sum + ' ₽</span>' +
        '<button class="remove-btn" data-id="' + product.id + '">Удалить</button>';

      cartItemsBox.appendChild(row);
    });
  }

  updateTotals();
}

function updateTotals() {
  let totalSum = 0;
  let totalCount = 0;

  cart.forEach(function (item) {
    const product = products.find(function (p) {
      return p.id === item.id;
    });

    totalSum += product.price * item.quantity;
    totalCount += item.quantity;
  });

  cartTotalEl.textContent = totalSum;
  cartSumEl.textContent = totalSum;
  cartCountEl.textContent = totalCount;
}

function addToCart(id) {
  const existingItem = cart.find(function (item) {
    return item.id === id;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (item) {
    return item.id !== id;
  });

  renderCart();
}

function changeQuantity(id, delta) {
  const item = cart.find(function (item) {
    return item.id === id;
  });

  if (!item) {
    return;
  }

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  renderCart();
}

catalogGrid.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    const id = Number(event.target.dataset.id);
    addToCart(id);
  }
});

cartItemsBox.addEventListener('click', function (event) {
  const target = event.target;

  if (target.classList.contains('qty-btn')) {
    const id = Number(target.dataset.id);
    const action = target.dataset.action;
    changeQuantity(id, action === 'increase' ? 1 : -1);
  }

  if (target.classList.contains('remove-btn')) {
    const id = Number(target.dataset.id);
    removeFromCart(id);
  }
});

cartToggleBtn.addEventListener('click', function () {
  cartSection.scrollIntoView({ behavior: 'smooth' });
});

orderInputs.forEach(function (input) {
  input.addEventListener('invalid', function () {
    input.setCustomValidity('Пожалуйста, заполните это поле');
  });

  input.addEventListener('input', function () {
    input.setCustomValidity('');
  });
});

renderCatalog();
renderCart();
