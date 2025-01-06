document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartBody = document.getElementById('cart-body');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = {}; // Object to store cart items

    /**
     * Fetch products from the API and render them on the page.
     */
    async function fetchProducts() {
        try {
            console.log('Fetching products...');
            const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/guest/fetch_products.php');

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            const products = await response.json();

            if (Array.isArray(products)) {
                renderProducts(products);
            } else {
                throw new Error('Invalid product format received from the API.');
            }
        } catch (error) {
            console.error('Error during fetchProducts:', error);
            productList.innerText = 'Failed to load products. Please try again later.';
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

            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 mb-4';

            const cardInner = document.createElement('div');
            cardInner.className = 'product-card text-center p-3 border rounded';

            // Product Image
            const productImg = document.createElement('img');
            productImg.src = product.image_path || '/assets/default-image.jpg';  //need to put the image
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
        if (quantity <= 0 || isNaN(quantity)) {
            alert('Please enter a valid quantity.');
            return;
        }

        if (!cart[productId]) {
            cart[productId] = { name, price: parseFloat(price), quantity: quantity };
        } else {
            cart[productId].quantity += quantity;
        }
        updateCartView();
    }
    async function checkout() {
        try {
            if (Object.keys(cart).length === 0) {
                alert('Your cart is empty. Please add items before checking out.');
                return;
            }
    
            const paymentMethod = document.getElementById('payment-method').value;
            const checkoutPayload = {
                customer_id: 1, // replace the customer_id with 0 which indicates the clerk
                items: Object.entries(cart).map(([id, item]) => ({
                    product_id: parseInt(id, 10),
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity, 10)
                })),
                payment_method: paymentMethod
            };
    
            console.log('Checkout Payload:', checkoutPayload);
    
            const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/clerk/checkout_order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(checkoutPayload)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
    
            const result = await response.json();
            console.log(result);
    
            alert(result.message || 'Order placed successfully!');
            cart = {};
            updateCartView();
        } catch (error) {
            console.error('Checkout Error:', error);
            alert(`Failed to complete checkout: ${error.message}`);
        }
    }
    

    /**
     * Update the cart display 
     */
function updateCartView() {
    cartBody.innerText = ''; // Clear the cart display securely
    let totalAmount = 0;

    if (Object.keys(cart).length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.className = 'text-center';
        emptyCell.innerText = 'Your cart is empty.';
        emptyRow.appendChild(emptyCell);
        cartBody.appendChild(emptyRow);
        return;
    }

    for (let id in cart) {
        const item = cart[id];
        const total = item.price * item.quantity;
        totalAmount += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>RM${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>RM${total.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm remove-btn" data-id="${id}">Remove</button></td>
        `;
        cartBody.appendChild(row);
    }

    cartBody.innerHTML += `
        <tr>
            <td colspan="3" class="text-end fw-bold">Grand Total:</td>
            <td colspan="2" class="fw-bold">RM${totalAmount.toFixed(2)}</td>
        </tr>
    `;

    // Attach event listeners to dynamically added remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            removeFromCart(productId);
        });
    });
}


    function removeFromCart(productId) {
        delete cart[productId];
        updateCartView();
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    fetchProducts();
});
