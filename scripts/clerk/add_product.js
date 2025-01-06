/**
 * Add New Product Function
 */
async function addProduct() {
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').files[0];

    // Validate Inputs
    if (!name || !description || !price || !category || !image) {
        alert('Please fill in all fields and upload an image.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);

    try {
        const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/clerk/add_new_product.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message || 'Product added successfully!');
            document.getElementById('add-product-form').reset();
        } else {
            alert(result.error || 'Failed to add product.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the product.');
    }
}
