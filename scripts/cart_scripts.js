
/**
 * Navigate to the cart page
 */
function proceedToCart() {
    console.log('Proceeding to the cart page');
    window.location.href = '/view/cart_page.html'; // Redirect to the cart page
}

/**
 * Fetch Cart Count from Backend and Update Floating Cart Button
 */
async function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');

    try {
        console.log('Fetching cart count...');
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/cart_count.php');

        if (!response.ok) {
            throw new Error('Failed to fetch cart count');
        }

        const result = await response.json();
        console.log('Cart Count:', result);

        if (typeof result.count === 'number' && result.count >= 0) {
            cartCountElement.innerText = result.count;
            cartCountElement.style.display = result.count > 0 ? 'inline-block' : 'none';
        } else {
            console.warn('Invalid cart count response:', result);
            cartCountElement.innerText = '0';
            cartCountElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching cart count:', error);
        cartCountElement.innerText = '0';
        cartCountElement.style.display = 'none';
    }
}

/**
 * Add a product to the cart via API and update the cart count
 * @param {number} productId - ID of the product to add to the cart
 */
async function addToCart(productId) {
    try {
        if (typeof productId !== 'number' || productId <= 0) {
            console.error('Invalid productId:', productId);
            alert('Invalid product selection.');
            return;
        }

        console.log('Adding to cart, Product ID:', productId);

        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/add_to_cart.php', {
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

        if (response.ok && result.success) {
            alert(result.success || 'Product added to cart successfully!');
            updateCartCount(); // Update cart count dynamically
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
 * Fetch Cart Items from Backend
 */
async function fetchCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    // Check if cart-items container exists
    if (!cartItemsContainer) {
        console.error('Error: #cart-items element not found in the DOM.');
        return;
    }
    if (!totalPriceElement) {
        console.error('Error: #total-price element not found in the DOM.');
        return;
    }

    let cartItems = [];
    try {
        console.log('Fetching cart items...');
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/view_cart.php');

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        cartItems = await response.json();
        console.log('Cart Items:', cartItems);

        if (!Array.isArray(cartItems)) {
            throw new Error('Invalid cart data format');
        }

        renderCartItems(cartItems);
        calculateTotal(cartItems, totalPriceElement); // Ensure totals are calculated
    } catch (error) {
        console.error('Error fetching cart items:', error);
        cartItemsContainer.innerText = 'Failed to load cart items. Please try again later.';
        totalPriceElement.innerText = 'RM0.00';
    }
}

/**
 * Render Cart Items in the DOM
 * @param {Array} cartItems - Array of cart items
 */
function renderCartItems(cartItems) {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) {
        console.error('Error: #cart-items element not found during render.');
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear previous content

    if (cartItems.length === 0) {
        cartItemsContainer.innerText = 'Your cart is empty.';
        return;
    }

    cartItems.forEach(item => {
        if (!item.cart_id || !item.product_name || !item.price || !item.quantity) {
            console.warn('Invalid cart item detected:', item);
            return;
        }

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item d-flex align-items-center mb-3 p-2 border rounded';
        cartItemDiv.style.gap = '15px';

        // Product Image
        const imgDiv = document.createElement('div');
        imgDiv.style.flex = '0 0 80px';
        const img = document.createElement('img');
        img.src = item.image_path || '/assets/default-image.jpg';
        img.alt = item.product_name;
        img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 8px;';
        imgDiv.appendChild(img);

        // Product Details
        const detailsDiv = document.createElement('div');
        detailsDiv.style.flex = '1';
        const productName = document.createElement('h5');
        productName.innerText = item.product_name;
        const productPrice = document.createElement('p');
        productPrice.innerText = `RM${parseFloat(item.price).toFixed(2)}`;
        detailsDiv.appendChild(productName);
        detailsDiv.appendChild(productPrice);

        // Quantity Controls
        const quantityDiv = document.createElement('div');
        quantityDiv.style.display = 'flex';
        quantityDiv.style.alignItems = 'center';
        quantityDiv.style.gap = '5px';

        const btnMinus = document.createElement('button');
        btnMinus.className = 'btn btn-sm btn-outline-danger';
        btnMinus.innerText = '-';
        btnMinus.onclick = () => updateQuantity(item.cart_id, item.quantity - 1);

        const quantitySpan = document.createElement('span');
        quantitySpan.id = `quantity-${item.cart_id}`;
        quantitySpan.className = 'fw-bold';
        quantitySpan.innerText = item.quantity;

        const btnPlus = document.createElement('button');
        btnPlus.className = 'btn btn-sm btn-outline-success';
        btnPlus.innerText = '+';
        btnPlus.onclick = () => updateQuantity(item.cart_id, item.quantity + 1);

        quantityDiv.appendChild(btnMinus);
        quantityDiv.appendChild(quantitySpan);
        quantityDiv.appendChild(btnPlus);

        // Total Price
        const totalDiv = document.createElement('div');
        totalDiv.style.textAlign = 'right';
        const totalText = document.createElement('p');
        totalText.id = `total-${item.cart_id}`;
        totalText.innerText = `RM${parseFloat(item.total).toFixed(2)}`;
        totalDiv.appendChild(totalText);

        // Append All
        cartItemDiv.appendChild(imgDiv);
        cartItemDiv.appendChild(detailsDiv);
        cartItemDiv.appendChild(quantityDiv);
        cartItemDiv.appendChild(totalDiv);

        cartItemsContainer.appendChild(cartItemDiv);
    });
}

/**
 * Update Quantity
 */
async function updateQuantity(cartId, newQuantity) {
    if (typeof cartId !== 'number' || typeof newQuantity !== 'number' || newQuantity < 0) {
        console.warn('Invalid update parameters:', { cartId, newQuantity });
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/update_cart_quantity.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id: cartId, quantity: newQuantity })
        });

        if (response.ok) {
            fetchCartItems();
        } else {
            throw new Error('Failed to update quantity');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

/**
 * Calculate Total Price
 * @param {Array} cartItems - Array of cart items
 * @param {HTMLElement} totalPriceElement - Element to display total price
 */
function calculateTotal(cartItems, totalPriceElement) {
    if (!Array.isArray(cartItems) || !totalPriceElement) {
        console.warn('Invalid parameters passed to calculateTotal');
        return;
    }

    const total = cartItems.reduce((sum, item) => {
        const itemTotal = parseFloat(item.total);
        return isNaN(itemTotal) ? sum : sum + itemTotal;
    }, 0);

    totalPriceElement.innerText = `RM${total.toFixed(2)}`;
    console.log('Total Price Calculated:', total);
}


// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

/**
 * Initialize Cart Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        fetchCartItems();
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    } else {
        console.error('Error: #cart-items element not found on DOMContentLoaded');
    }
});

document.addEventListener('DOMContentLoaded', fetchCartItems);
