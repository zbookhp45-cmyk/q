
const books = [
    {
        id: 1,
        name: "Classic Black",
        price: 85000,
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 2,
        name: "Silver Line",
        price: 95000,
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3,
        name: "Blue Point",
        price: 75000,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 4,
        name: "Gold Touch",
        price: 90000,
        image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85"
    }
];

let cart = [];

const cartOpen = document.getElementById("cartOpen");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const panelCount = document.getElementById("panelCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const modalClose = document.getElementById("modalClose");
const checkoutForm = document.getElementById("checkoutForm");
const toast = document.getElementById("toast");
const menuButton = document.getElementById("menuButton");
const navbar = document.getElementById("navbar");
const newsletterForm = document.getElementById("newsletterForm");

let toastTimer;

function formatPrice(price) {
    return price.toLocaleString("en-US") + " UZS";
}

function showToast(message) {
    toast.querySelector("span").textContent = message;
    toast.classList.add("active");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("active");
    }, 2500);
}

function addToCart(id) {
    const product = books.find(book => book.id === id);
    const cartProduct = cart.find(item => item.id === id);

    if (cartProduct) {
        cartProduct.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    updateCart();
    showToast("Pen added to cart!");
}

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalItems;
    panelCount.textContent = `(${totalItems})`;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>

                <div class="quantity">
                    <button type="button" data-action="minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-action="plus" data-id="${item.id}">+</button>
                </div>

                <button type="button" class="remove-button" data-action="remove" data-id="${item.id}">
                    Remove
                </button>
            </div>
        </div>
    `).join("");
}

function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
}

function openCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    checkoutModal.classList.add("active");
}

function closeCheckout() {
    checkoutModal.classList.remove("active");
}

document.querySelector(".books-grid").addEventListener("click", event => {
    const button = event.target.closest(".order-button");

    if (button) {
        addToCart(Number(button.dataset.id));
    }
});

cartOpen.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "plus") changeQuantity(id, 1);
    if (action === "minus") changeQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
});

checkoutButton.addEventListener("click", openCheckout);
modalClose.addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", event => {
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Your cart is empty!");
        closeCheckout();
        return;
    }

    cart = [];

    updateCart();
    checkoutForm.reset();
    closeCheckout();
    closeCart();

    showToast("Your order has been placed!");
});

menuButton.addEventListener("click", () => {
    navbar.classList.toggle("active");

    const isOpen = navbar.classList.contains("active");

    menuButton.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    newsletterForm.reset();
    showToast("Thanks for joining us!");
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
        navbar.classList.remove("active");
        menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});

updateCart();
