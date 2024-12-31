/**
 * Fetch Inventory Data
 */
async function fetchInventory() {
    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/clerk/get_inventory.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Safely Update Summary Cards
        const totalProductsElem = document.getElementById('total-products');
        const totalIngredientsElem = document.getElementById('total-ingredients');
        const lowStockElem = document.getElementById('low-stock-count');
        const noStockElem = document.getElementById('no-stock-count');

        if (totalProductsElem) totalProductsElem.innerText = data.totalProducts || '0';
        if (totalIngredientsElem) totalIngredientsElem.innerText = data.totalIngredients || '0';
        if (lowStockElem) lowStockElem.innerText = data.lowStockCount || '0';
        if (noStockElem) noStockElem.innerText = data.outOfStockCount || '0';

        // Populate Tables
        populateTable('inventory-table-body', data.products, 'product');
        populateTable('ingredient-table-body', data.ingredients, 'ingredient');
        populateTable('low-stock-table-body', data.lowStockItems, 'low-stock');
        populateTable('no-stock-table-body', data.outOfStockItems, 'out-of-stock');
    } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Failed to fetch inventory data. Please check the console for details.');
    }
}

/**
 * Populate Table with Data (Secure with innerText)
 */

function populateTable(elementId, items, type) {
    const tbody = document.getElementById(elementId);
    if (!tbody) {
        console.warn(`Table body with ID '${elementId}' not found.`);
        return;
    }

    tbody.innerHTML = '';

    if (!items || items.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = type === 'product' ? 7 : 5; // Adjust columns dynamically
        cell.className = 'text-center';
        cell.innerText = 'No data available';
        return;
    }

    items.forEach((item, index) => {
        const row = tbody.insertRow();

        // Index Column
        row.insertCell().innerText = index + 1;

        // Common Fields
        row.insertCell().innerText = item.name || item.item_name || '-';

        // Handle Product Table
        if (type === 'product') {
            row.insertCell().innerText = item.description || '-';
            row.insertCell().innerText = `RM${item.price || '-'}`;
            row.insertCell().innerText = item.stock || '-';
            row.insertCell().innerText = item.reorder_point || '-';
        } 

        // Handle Ingredient Table
        else if (type === 'ingredient') {
            row.insertCell().innerText = item.quantity || '-';
            row.insertCell().innerText = item.unit || '-';
            row.insertCell().innerText = item.supplier || '-';
        }

        // Handle Low Stock Table
        else if (type === 'low-stock') {
            row.insertCell().innerText = item.stock || '-';
            row.insertCell().innerText = item.reorder_point || '-';
        }

        // Handle Out of Stock Table
        else if (type === 'out-of-stock') {
            row.insertCell().innerText = item.stock || '0';
            row.insertCell().innerText = item.reorder_point || '-';
        }

        // Actions
        const actionsCell = row.insertCell();
        actionsCell.appendChild(createActionButton('edit', item.id, type));
        actionsCell.appendChild(createActionButton('delete', item.id, type));
        if (type === 'low-stock' || type === 'out-of-stock') {
            actionsCell.appendChild(createActionButton('restock', item.id, type));
        }
    });
}

/**
 * Create Action Buttons (Edit & Delete)
 */
function createActionButton(action, id, type) {
    const button = document.createElement('button');
    button.className = `btn btn-sm btn-${action === 'edit' ? 'warning' : action === 'delete' ? 'danger' : 'info'} me-1`;
    button.innerText = action === 'edit' ? 'Edit' : action === 'delete' ? 'Delete' : 'Restock';
    button.onclick = () => {
        if (action === 'edit') editItem(id, type);
        else if (action === 'delete') deleteItem(id, type);
        else if (action === 'restock') restockItem(id, type);
    };
    return button;
}

/**
 * Restock Item
 */
async function restockItem(itemId, type) {
    const restockQuantity = prompt(`Enter restock quantity for ${type} (ID: ${itemId}):`, '0');
    if (restockQuantity !== null && parseInt(restockQuantity) > 0) {
        try {
            const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/clerk/restock_item.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemId, quantity: parseInt(restockQuantity), type: type })
            });

            const result = await response.json();
            if (result.success) {
                alert(`Item restocked successfully!`);
                fetchInventory();
            } else {
                alert(`Failed to restock item: ${result.error}`);
            }
        } catch (error) {
            console.error('Error restocking item:', error);
            alert('Failed to restock item. Please check the console for more details.');
        }
    } else {
        alert('Invalid restock quantity. Please enter a positive number.');
    }
}
/**
 * Edit Item (Product, Ingredient, Low Stock, Out of Stock)
 */
function editItem(itemId, type) {
    alert(`Editing ${type} with ID: ${itemId}`);
    // Implement your edit functionality here
}

/**
 * Delete Item (Product, Ingredient, Low Stock, Out of Stock)
 */
function deleteItem(itemId, type) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        fetch(`/api/inventory/delete_item.php?id=${itemId}&type=${type}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.message || `${type} deleted successfully`);
                fetchInventory();
            })
            .catch(error => console.error(`Error deleting ${type}:`, error));
    }
}

/**
 * Open Add Modal for Product or Ingredient
 */
function openAddModal(type) {
    const modal = document.getElementById('addItemModal');
    const modalLabel = document.getElementById('addItemModalLabel');
    const dynamicFields = document.getElementById('dynamic-fields');

    if (!modal || !modalLabel || !dynamicFields) {
        console.error('Modal or dynamic fields container is missing in the DOM.');
        return;
    }

    // Clear previous fields
    dynamicFields.innerHTML = '';

    if (type === 'product') {
        dynamicFields.appendChild(createInput('item-name', 'Product Name'));
        dynamicFields.appendChild(createInput('item-description', 'Description'));
        dynamicFields.appendChild(createInput('item-price', 'Price', 'number'));
        dynamicFields.appendChild(createInput('item-stock', 'Stock', 'number'));
        dynamicFields.appendChild(createInput('item-reorder-point', 'Reorder Point', 'number'));
        dynamicFields.appendChild(createInput('item-category', 'Category'));
    }
    if (type === 'ingredient') {
        dynamicFields.appendChild(createInput('item-name', 'Ingredient Name'));
        dynamicFields.appendChild(createInput('item-quantity', 'Quantity', 'number'));
        dynamicFields.appendChild(createInput('item-unit', 'Unit'));
        dynamicFields.appendChild(createInput('item-supplier', 'Supplier'));
    }
    
    modalLabel.innerText = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

/**
 * Create Input Field for Modal
 */
function createInput(id, placeholder, type = 'text') {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    input.className = 'form-control mb-2';
    return input;
}

/**
 * Save Item (Product or Ingredient)
 */
async function saveItem() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
    const modalTitle = document.getElementById('addItemModalLabel').innerText;

    // Determine if it's a product or ingredient
    const type = modalTitle.toLowerCase().includes('product') ? 'product' : 'ingredient';

    let itemData = {};

    if (type === 'product') {
        // Collect Product Data
        itemData = {
            type: 'product',
            name: document.getElementById('item-name').value,
            description: document.getElementById('item-description').value,
            price: document.getElementById('item-price').value,
            stock: document.getElementById('item-stock').value,
            reorder_point: document.getElementById('item-reorder-point').value,
            category: document.getElementById('item-category').value
        };
    } else if (type === 'ingredient') {
        // Collect Ingredient Data
        itemData = {
            type: 'ingredient',
            name: document.getElementById('item-name').value,
            quantity: document.getElementById('item-quantity').value,
            unit: document.getElementById('item-unit').value,
            supplier: document.getElementById('item-supplier').value
        };
    }

    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/clerk/add_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message || `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
            modal.hide();
            fetchInventory(); // Refresh the inventory list
        } else {
            alert(result.error || `Failed to add ${type}`);
        }
    } catch (error) {
        console.error(`Error saving ${type}:`, error.message);
        alert(`Failed to save ${type}`);
    }
}




// Load Inventory on Page Load
document.addEventListener('DOMContentLoaded', fetchInventory);
