/**
 * Add New Product Function
 */
async function addProduct() {
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const stock = document.getElementById('product-stock').value.trim();
    const reorder = document.getElementById('product-reorder').value.trim();
    const imageInput = document.getElementById('product-image');
    const image = imageInput.files[0];

    // Validate Inputs
    if (!name || !description || !price || !image) {
        alert('Please fill in all fields and upload an image.');
        return;
    }

    // Validate Image File Type (Allowed: jpg, png)
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const imageExtension = image.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(imageExtension)) {
        alert('Only JPG and PNG image formats are allowed.');
        imageInput.value = ''; // Clear the file input
        document.getElementById('image-preview').innerHTML = '';
        return;
    }

    // Validate Image File Size (Max: 1MB)
    if (image.size > 1 * 1024 * 1024) {
        alert('The image file size must be less than 1MB.');
        imageInput.value = ''; // Clear the file input
        document.getElementById('image-preview').innerHTML = '';
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('reorder', reorder);
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
            document.getElementById('image-preview').innerHTML = '';
        } else {
            alert(result.error || 'Failed to add product.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the product.');
    }
}

/**
 * Display Image Preview on File Upload
 */
document.getElementById('product-image').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('image-preview');

    // Clear Previous Preview
    previewContainer.innerHTML = '';

    if (file) {
        // Validate File Type (Allowed: jpg, png)
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const imageExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(imageExtension)) {
            alert('Only JPG and PNG image formats are allowed.');
            event.target.value = ''; // Clear file input
            return;
        }

        // Validate File Size (Max: 1MB)
        if (file.size > 1 * 1024 * 1024) {
            alert('The image file size must be less than 1MB.');
            event.target.value = ''; // Clear file input
            return;
        }

        // Display Image Preview
        const reader = new FileReader();
        reader.onload = function (e) {
            previewContainer.innerHTML = `
                <img src="${e.target.result}" alt="Product Image Preview" style="max-width: 200px; margin-top: 10px; border: 1px solid #ccc; padding: 5px;">
            `;
        };
        reader.readAsDataURL(file);
    }
});
