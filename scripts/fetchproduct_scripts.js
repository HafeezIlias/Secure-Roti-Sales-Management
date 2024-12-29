document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    async function fetchProducts() {
        try {
            console.log('Fetching products...');
            const response = await fetch('http://127.0.0.1/SECURE ROTI SALES MANAGEMENT/api/fetch_products.php');

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            const products = await response.json();
            console.log('Fetched products:', products); // Log the data to verify response

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
 * Render Products in the DOM using innerText
 * @param {Array} products - Array of product objects
 */
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous content

    if (products.length === 0) {
        productList.innerText = 'No products available.';
        return;
    }

    products.forEach(product => {
        // Create the product card
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';

        productCard.innerHTML = `
            <div class="product-card text-center">
                <img src="${product.image_path}" 
                     alt="${product.name}" 
                     class="img-fluid mb-3"
                     style="height: 200px; object-fit: cover;">
            </div>
        `;

        // Add product name
        const productName = document.createElement('h5');
        productName.innerText = product.name;
        productCard.querySelector('.product-card').appendChild(productName);

        // Add product description
        const productDescription = document.createElement('p');
        productDescription.innerText = product.description;
        productCard.querySelector('.product-card').appendChild(productDescription);

        // Add product price
        const productPrice = document.createElement('div');
        productPrice.className = 'price';
        productPrice.innerText = `RM${parseFloat(product.price).toFixed(2)}`;
        productCard.querySelector('.product-card').appendChild(productPrice);

        // Add Add-to-Cart button
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn btn-warning btn-sm';
        addToCartBtn.innerText = 'Add to Cart';
        addToCartBtn.onclick = () => addToCart(product.product_id);
        productCard.querySelector('.product-card').appendChild(addToCartBtn);

        // Append the product card to the list
        productList.appendChild(productCard);
    });
}


    fetchProducts();
});
