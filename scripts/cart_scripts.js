// cart_scripts.js

/**
 * Add a product to the cart via API
 * @param {number} productId - ID of the product to add to the cart
 */
async function addToCart(productId) {
    try {
        console.log('Adding to cart, Product ID:', productId);

        const response = await fetch('http://127.0.0.1/SECURE ROTI SALES MANAGEMENT/api/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        const result = await response.json();
        console.log('Response:', result);

        if (response.ok) {
            alert(result.success || 'Product added to cart successfully!');
        } else {
            console.error('Add to cart failed:', result.error || 'Unknown error');
            alert('Failed to add product to cart. Please try again.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('An error occurred while adding the product to the cart.');
    }
}

/**
 * Navigate to the cart page
 */
function proceedToCart() {
    console.log('Proceeding to the cart page');
    window.location.href = '/view/cart_page.html'; // Redirect to the cart page
}

/**
 * Fetch Cart Items from Backend
 */
async function fetchCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let cartItems = [];
    let total = 0;

    try {
        console.log('Fetching cart items...');
        const response = await fetch('http://127.0.0.1/SECURE ROTI SALES MANAGEMENT/api/view_cart.php');
        
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        cartItems = await response.json();
        console.log('Cart Items:', cartItems);

        renderCartItems(cartItems);
        calculateTotal(cartItems, totalPriceElement);

    } catch (error) {
        console.error('Error fetching cart items:', error);
        cartItemsContainer.innerHTML = '<p class="text-center text-danger">Failed to load cart items.</p>';
    }
}

/**
 * Render Cart Items in the DOM
 * @param {Array} cartItems - Array of cart items
 */

function renderCartItems(cartItems) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item d-flex align-items-center mb-3 p-2 border rounded" style="gap: 15px;">
                <!-- Product Image -->
                <div style="flex: 0 0 80px;">
                    <img src="${item.image_path || '/assets/default-image.jpg'}" 
                         alt="${item.product_name}" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                </div>

                <!-- Product Details -->
                <div style="flex: 1;">
                    <h5 class="mb-1">${item.product_name}</h5>
                    <p class="mb-1">RM${parseFloat(item.price).toFixed(2)}</p>
                </div>

                <!-- Quantity Controls -->
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button onclick="updateQuantity(${item.cart_id}, ${item.quantity - 1})" class="btn btn-sm btn-outline-danger">-</button>
                    <span id="quantity-${item.cart_id}" class="fw-bold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.cart_id}, ${item.quantity + 1})" class="btn btn-sm btn-outline-success">+</button>
                </div>

                <!-- Total Price -->
                <div style="text-align: right;">
                    <p class="mb-0" id="total-${item.cart_id}">RM${parseFloat(item.total).toFixed(2)}</p>
                </div>
            </div>
        `;
    });
}

/**
 * Update Quantity Dynamically
 * @param {number} cartId - ID of the cart item
 * @param {number} newQuantity - New quantity value
 */
async function updateQuantity(cartId, newQuantity) {
    try {
        console.log(`Updating cart ID ${cartId} to quantity ${newQuantity}`);

        const response = await fetch('http://127.0.0.1/SECURE ROTI SALES MANAGEMENT/api/update_cart_quantity.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart_id: cartId,
                quantity: newQuantity
            })
        });

        const result = await response.json();
        console.log('Response:', result);

        if (response.ok) {
            // Refresh cart data after update
            fetchCartItems();
        } else {
            console.error('Failed to update cart:', result.error || 'Unknown error');
            alert('Failed to update cart item. Please try again.');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('An error occurred while updating the cart item.');
    }
}

/**
 * Calculate Total Price
 * @param {Array} cartItems - Array of cart items
 * @param {HTMLElement} totalPriceElement - Element to display total price
 */
function calculateTotal(cartItems, totalPriceElement) {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
    totalPriceElement.innerText = total.toFixed(2);
    console.log('Total Price:', total);
}

/**
 * Handle Checkout Button Click
 */
function handleCheckout() {
    const totalPriceElement = document.getElementById('total-price');
    const total = parseFloat(totalPriceElement.innerText);

    if (total === 0) {
        alert('Your cart is empty! Please add items before proceeding to checkout.');
        return;
    }

    alert(`Proceeding to checkout. Total Amount: RM${total.toFixed(2)}`);
    // Future: Implement Checkout Page Redirection
}

// Initialize Cart Page Logic
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        fetchCartItems();
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    }
});
