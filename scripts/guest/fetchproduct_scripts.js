document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    async function fetchProducts() {
        try {
            console.log('Fetching products...');
            const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/guest/fetch_products.php');

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
/**
 * Render Products in the DOM securely using innerText and dynamic elements
 * @param {Array} products - Array of product objects
 */
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous content

    if (!products || products.length === 0) {
        productList.innerText = 'No products available.';
        return;
    }

    products.forEach(product => {
        // Validate product object
        if (!product.product_id || !product.name || !product.price || !product.image_path) {
            console.warn('Invalid product data:', product);
            return;
        }

        // Create the product card container
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

        // Add-to-Cart Button
        const addToCartBtn = document.createElement('button');
        addToCartBtn.innerText = 'Add to Cart';
        addToCartBtn.className = 'btn btn-warning btn-sm';
        addToCartBtn.onclick = () => addToCart(product.product_id);
        cardInner.appendChild(addToCartBtn);

        // Append all to the main product card container
        productCard.appendChild(cardInner);
        productList.appendChild(productCard);
    });
}



    fetchProducts();
});
