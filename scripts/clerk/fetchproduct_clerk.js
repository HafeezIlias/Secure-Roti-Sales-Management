document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartBody = document.getElementById('cart-body');

    let cart = {}; // Object to store cart items

    /**
     * Fetch products from the API and render them on the page.
     */
    async function fetchProducts() {
        try {
            console.log('Fetching products...');
            const response = await fetch('http://127.0.0.1/SECURE ROTI SALES MANAGEMENT/api/guest/fetch_products.php');

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            const products = await response.json();
            console.log('Fetched products:', products);

            if (Array.isArray(products)) {
                renderProducts(products);
            } else {
                console.error('Invalid response format:', products);
            }
        } catch (error) {
            console.error('Error during fetchProducts:', error);
        }
    }

    /**
     * Render the list of products on the page.
     * @param {Array} products - Array of product objects.
     */
    function renderProducts(products) {
        productList.innerText = ''; // Clear previous content securely

        if (!products || products.length === 0) {
            productList.innerText = 'No products available.';
            return;
        }

        products.forEach(product => {
            if (!product.product_id || !product.name || !product.price || !product.image_path) {
                console.warn('Invalid product data:', product);
                return;
            }

            // Create product card container
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 mb-4';

            const cardInner = document.createElement('div');
            cardInner.className = 'product-card text-center p-3 border rounded';

            // Product Image
            const productImg = document.createElement('img');
            productImg.src = product.image_path || '/assets/default-image.jpg';
            productImg.alt = product.name;
            productImg.className = 'img-fluid mb-3';
            productImg.style.cssText = 'height: 200px; object-fit: cover; border-radius: 8px;';
            cardInner.appendChild(productImg);

            // Product Name
            const productName = document.createElement('h5');
            productName.innerText = product.name;
            productName.className = 'fw-bold mb-1';
            cardInner.appendChild(productName);

            // Product Description
            const productDescription = document.createElement('p');
            productDescription.innerText = product.description || 'No description available';
            productDescription.className = 'text-muted mb-1';
            cardInner.appendChild(productDescription);

            // Product Price
            const productPrice = document.createElement('div');
            productPrice.innerText = `RM${parseFloat(product.price).toFixed(2)}`;
            productPrice.className = 'price fw-bold mb-2';
            cardInner.appendChild(productPrice);

            // Quantity Input
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = 1;
            quantityInput.min = 1;
            quantityInput.className = 'form-control mb-2';
            cardInner.appendChild(quantityInput);

            // Add to Cart Button
            const addToCartBtn = document.createElement('button');
            addToCartBtn.innerText = 'Add to Cart';
            addToCartBtn.className = 'btn btn-primary';
            addToCartBtn.onclick = () => addToCart(
                product.product_id,
                product.name,
                parseFloat(product.price),
                parseInt(quantityInput.value) || 1
            );
            cardInner.appendChild(addToCartBtn);

            productCard.appendChild(cardInner);
            productList.appendChild(productCard);
        });
    }

    /**
     * Add a product to the cart.
     * @param {string} productId - Product ID.
     * @param {string} name - Product Name.
     * @param {number} price - Product Price.
     * @param {number} quantity - Product Quantity.
     */
    function addToCart(productId, name, price, quantity) {
        if (!cart[productId]) {
            cart[productId] = { name, price: parseFloat(price), quantity: quantity };
        } else {
            cart[productId].quantity += quantity;
        }
        updateCartView();
    }

/**
 * Checkout Cart and Send Data to Backend
 */
    async function checkout() {
        try {
            const response = await fetch('http://127.0.0.1/SECURE ROTI SALES MANAGEMENT/api/clerk/checkout_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cart)
            });

            if (!response.ok) {
                throw new Error(`Failed to checkout: ${response.statusText}`);
            }

            const result = await response.json();
            alert(result.message || 'Order placed successfully!');
            cart = {};
            updateCartView();
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Failed to complete checkout.');
        }
    }

    /**
     * Update the cart display securely without using innerHTML.
     */
    function updateCartView() {
        cartBody.innerText = ''; // Clear the cart display securely
        let totalAmount = 0;

        for (let id in cart) {
            const item = cart[id];
            const price = parseFloat(item.price); // Ensure price is always a number
            const quantity = parseInt(item.quantity); // Ensure quantity is always an integer
            const total = price * quantity;
            totalAmount += total;

            const row = document.createElement('tr');

            // Product Name
            const nameCell = document.createElement('td');
            nameCell.innerText = item.name;
            row.appendChild(nameCell);

            // Price
            const priceCell = document.createElement('td');
            priceCell.innerText = `RM${price.toFixed(2)}`;
            row.appendChild(priceCell);

            // Quantity
            const quantityCell = document.createElement('td');
            quantityCell.innerText = quantity;
            row.appendChild(quantityCell);

            // Total
            const totalCell = document.createElement('td');
            totalCell.innerText = `RM${total.toFixed(2)}`;
            row.appendChild(totalCell);

            // Remove Button
            const actionCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.innerText = 'Remove';
            removeBtn.className = 'btn btn-danger btn-sm';
            removeBtn.onclick = () => removeFromCart(id);
            actionCell.appendChild(removeBtn);
            row.appendChild(actionCell);

            cartBody.appendChild(row);
        }

        // Grand Total Row
        const totalRow = document.createElement('tr');
        const totalTextCell = document.createElement('td');
        totalTextCell.colSpan = 3;
        totalTextCell.className = 'text-end fw-bold';
        totalTextCell.innerText = 'Grand Total:';
        totalRow.appendChild(totalTextCell);

        const totalValueCell = document.createElement('td');
        totalValueCell.colSpan = 2;
        totalValueCell.className = 'fw-bold';
        totalValueCell.innerText = `RM${totalAmount.toFixed(2)}`;
        totalRow.appendChild(totalValueCell);

        cartBody.appendChild(totalRow);
    }

    function removeFromCart(productId) {
        delete cart[productId];
        updateCartView();
    }

    fetchProducts();
});
