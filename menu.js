let cart = JSON.parse(localStorage.getItem('gravehoundCart')) || [];

function updateCartDisplay() {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) return;

    // Check if cart is empty
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-cart-shopping empty-cart-icon"></i>
                <p>Your cart is void.</p>
                <a href="index.html" style="color: #fff; text-decoration: underline; margin-top: 10px; display: block;">Return to the shadows</a>
            </div>
        `;
        return;
    }

    // Reset structure if it was overwritten by empty state
    cartContent.innerHTML = `
        <div class="cart-items"></div>
        <div class="cart-summary"></div>
    `;

    const cartItemsContainer = cartContent.querySelector('.cart-items');
    const cartSummaryContainer = cartContent.querySelector('.cart-summary');

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">₹${item.price}</span>
            </div>
            <button class="remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Render Summary
    cartSummaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal</span>
            <span>₹${total}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
        </div>
        <div class="summary-total">
            <div class="summary-row" style="margin-bottom: 0;">
                <span>Total</span>
                <span>₹${total}</span>
            </div>
        </div>
        <button class="checkout-btn">Proceed to Checkout</button>
    `;

    // Re-attach event listeners
    const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            localStorage.setItem('gravehoundCart', JSON.stringify(cart));
            updateCartDisplay();
        });
    });

    // Add checkout listener (demo)
    const checkoutBtn = cartSummaryContainer.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Proceeding to checkout...');
        });
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function addToCart(item) {
    cart.push(item);
    localStorage.setItem('gravehoundCart', JSON.stringify(cart));
    updateCartDisplay();
    showToast(`${item.name} added to shadows.`);
}

const addToCartBtns = document.querySelectorAll('.add-to-cart');
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = {
            name: btn.dataset.name,
            price: parseInt(btn.dataset.price),
            image: btn.dataset.image
        };
        addToCart(item);
    });
});

window.addEventListener('DOMContentLoaded', updateCartDisplay);
