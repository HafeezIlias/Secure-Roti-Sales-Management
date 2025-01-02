// Create a New Order
function createNewOrder() {
    window.location.href = '/view/clerk/order_page.html';
}

// Load Orders Page
function loadOrderPage() {
    window.location.href = '/view/clerk/order_page.html';
}

// Load Inventory Page
function loadInventoryPage() {
    window.location.href = '/view/clerk/inventory_page.html';
}
// Load Add Product Page
function loadaddProductPage() {
    window.location.href = '/view/clerk/add_product_page.html';
}


// Add New Product
function addProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').files[0];

    if (!name || !description || !price || !image) {
        alert('Please fill out all fields and upload an image.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    fetch('/api/products/add_product.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Product added successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add product.');
    });
}
