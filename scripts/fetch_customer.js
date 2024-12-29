// 📝 Fetch Customers from the Server
async function fetchCustomers() {
    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/fetch_customer.php');
        const customers = await response.json();

        const customerList = document.getElementById('customer-list');
        customerList.innerHTML = ''; // Clear the list before rendering

        if (!Array.isArray(customers) || customers.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="5" style="text-align:center; color:gray;">No customers available.</td>`;
            customerList.appendChild(noDataRow);
            return;
        }

        customers.forEach(customer => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.innerText = customer.id || '-';

            const nameCell = document.createElement('td');
            nameCell.innerText = customer.name || '-';

            const contactCell = document.createElement('td');
            contactCell.innerText = customer.contact || '-';

            const addressCell = document.createElement('td');
            addressCell.innerText = customer.address || '-';

            const actionsCell = document.createElement('td');
            actionsCell.className = 'action-buttons';

            // Edit Button
            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.className = 'edit-btn';
            editButton.onclick = () => openEditCustomerModal(customer.id, customer.name, customer.contact, customer.address);

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = () => deleteCustomer(customer.id);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(contactCell);
            row.appendChild(addressCell);
            row.appendChild(actionsCell);

            customerList.appendChild(row);
        });

        // Update Total Customer Count
        document.getElementById('customer-count').innerText = customers.length;
    } catch (error) {
        console.error('Failed to fetch customers:', error.message);
        alert('Failed to fetch customers. Please check the server connection.');
    }
}

// 📝 Open Add Customer Modal
function openCustomerModal() {
    document.getElementById('customer-id').value = '';
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-contact').value = '';
    document.getElementById('customer-address').value = '';

    document.getElementById('modal-title').innerText = 'Add Customer';
    document.getElementById('customer-modal').style.display = 'flex';
}

// 📝 Open Edit Customer Modal
function openEditCustomerModal(id, name, contact, address) {
    document.getElementById('customer-id').value = id;
    document.getElementById('customer-name').value = name;
    document.getElementById('customer-contact').value = contact;
    document.getElementById('customer-address').value = address;

    document.getElementById('modal-title').innerText = 'Edit Customer';
    document.getElementById('customer-modal').style.display = 'flex';
}

// 📝 Close Modal
function closeCustomerModal() {
    document.getElementById('customer-modal').style.display = 'none';
    document.getElementById('customer-form').reset();
}

// 📝 Save Customer (Add or Update)
async function saveCustomer() {
    const id = document.getElementById('customer-id').value.trim();
    const name = document.getElementById('customer-name').value.trim();
    const contact = document.getElementById('customer-contact').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !contact || !address) {
        alert('Please fill in all required fields.');
        return;
    }

    const payload = { name, contact, address };

    try {
        let url = 'http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/add_customer.php';
        let method = 'POST';

        if (id) {
            url = `http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/update_customer.php?id=${id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        console.log(result.message || 'Customer saved successfully');
        closeCustomerModal();
        fetchCustomers(); // Refresh the customer list
    } catch (error) {
        console.error('Failed to save customer:', error.message);
        alert(`Failed to save customer: ${error.message}`);
    }
}

// 📝 Delete Customer
async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) {
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/delete_customer.php?id=${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        console.log(result.message || 'Customer deleted successfully');
        fetchCustomers(); // Refresh customer list
    } catch (error) {
        console.error('Failed to delete customer:', error.message);
        alert(`Failed to delete customer: ${error.message}`);
    }
}

// 📝 Initialize on load
fetchCustomers();
