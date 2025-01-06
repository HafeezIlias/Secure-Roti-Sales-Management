
async function fetchInventory() {
    const inventoryTable = document.getElementById('inventory-table');
    inventoryTable.innerText = ''; // Clear previous content

    try {
        const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/inventory/fetch_inventory.php?action=read');
        const items = await response.json();

        if (!Array.isArray(items) || items.length === 0) {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 5;
            noDataCell.innerText = 'No inventory items available.';
            noDataCell.style.textAlign = 'center';
            noDataCell.style.color = 'red';
            noDataRow.appendChild(noDataCell);
            inventoryTable.appendChild(noDataRow);
            return;
        }

        items.forEach(item => {
            if (!item.id || !item.item_name || !item.stock || !item.reorder_point) {
                console.warn('Invalid inventory data:', item);
                return;
            }

            // Create Table Row
            const row = document.createElement('tr');

            // ID Column
            const idCell = document.createElement('td');
            idCell.innerText = item.id;
            row.appendChild(idCell);

            // Item Name Column
            const nameCell = document.createElement('td');
            nameCell.innerText = item.item_name;
            row.appendChild(nameCell);

            // Stock Column
            const stockCell = document.createElement('td');
            stockCell.innerText = item.stock;
            row.appendChild(stockCell);

            // Reorder Point Column
            const reorderCell = document.createElement('td');
            reorderCell.innerText = item.reorder_point;
            row.appendChild(reorderCell);

            // Actions Column
            const actionsCell = document.createElement('td');

            // Edit Button
            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.className = 'btn btn-primary btn-sm me-2';
            editButton.onclick = () => openModal('edit', item.id, item.item_name, item.stock, item.reorder_point);
            actionsCell.appendChild(editButton);

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.onclick = () => deleteItem(item.id);
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            // Append Row to Table
            inventoryTable.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching inventory:', error.message);
        const errorRow = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.colSpan = 5;
        errorCell.innerText = 'Failed to load inventory data.';
        errorCell.style.textAlign = 'center';
        errorCell.style.color = 'red';
        errorRow.appendChild(errorCell);
        inventoryTable.appendChild(errorRow);
    }
}


function openModal(mode, id = '', name = '', stock = '', reorder = '') {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const itemId = document.getElementById('item-id');
    const itemName = document.getElementById('item-name');
    const itemStock = document.getElementById('stock');
    const itemReorder = document.getElementById('reorder-point');

    modal.style.display = 'block';

    if (mode === 'add') {
        modalTitle.innerText = 'Add New Item';
        itemId.value = ''; // Clear ID for new item
        itemName.value = '';
        itemStock.value = '';
        itemReorder.value = '';
    } else if (mode === 'edit') {
        modalTitle.innerText = 'Edit Item';
        itemId.value = id;
        itemName.value = name;
        itemStock.value = stock;
        itemReorder.value = reorder;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

async function deleteItem(id) {
    await fetch(`http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/inventory.php?action=delete&id=${id}`);
    fetchInventory();
}

document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const stock = document.getElementById('stock').value;
    const reorder = document.getElementById('reorder-point').value;

    const payload = {
        id: id || null, // If ID is empty, it's a new item
        name,
        stock,
        reorder
    };

    try {
        await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/inventory/fetch_inventory.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        closeModal();
        fetchInventory();
    } catch (error) {
        console.error('Error saving inventory item:', error.message);
    }
});

fetchInventory();
