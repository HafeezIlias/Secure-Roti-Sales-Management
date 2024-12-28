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

    function renderProducts(products) {
        productList.innerHTML = ''; // Clear previous content

        if (products.length === 0) {
            productList.innerHTML = '<p>No products available.</p>';
            return;
        }

        products.forEach(product => {
            productList.innerHTML += `
                <div class="col-md-4">
                    <div class="product-card text-center">
                        <img src="${product.image_path}" 
                             alt="${product.name}" 
                             class="img-fluid mb-3"
                             style="height: 200px; object-fit: cover;">
                        <h5>${product.name}</h5>
                        <p>${product.description}</p>
                        <div class="price">RM${parseFloat(product.price).toFixed(2)}</div>
                        <button class="btn btn-warning btn-sm">Add to Cart</button>
                    </div>
                </div>
            `;
        });
    }

    fetchProducts();
});
