// 🛡️ Utility Function: Safely Get DOM Elements
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found.`);
    }
    return element;
}

// 📝 Fetch Customers from the Server
async function fetchCustomers() {
    try {
        const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/admin/fetch_customer.php');
        const customers = await response.json();

        const customerList = getElement('customer-list');
        if (!customerList) return;

        customerList.innerText = ''; // Clear previous content

        if (!Array.isArray(customers) || customers.length === 0) {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 11;
            noDataCell.innerText = 'No customers available.';
            noDataCell.style.textAlign = 'center';
            noDataCell.style.color = 'gray';
            noDataRow.appendChild(noDataCell);
            customerList.appendChild(noDataRow);
            return;
        }

        customers.forEach((customer) => {
            const row = document.createElement('tr');

            const fields = [
                customer.id,
                customer.username,
                customer.name,
                customer.email,
                customer.contact,
                customer.address,
                customer.postcode,
                customer.country,
                customer.city,
                customer.created_at
            ];

            fields.forEach((field) => {
                const cell = document.createElement('td');
                cell.innerText = field || '-';
                row.appendChild(cell);
            });

            // Actions Column
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.className = 'btn btn-warning btn-sm me-1';
            editButton.onclick = () =>
                openEditCustomerModal(
                    customer.id,
                    customer.username,
                    customer.name,
                    customer.email,
                    customer.contact,
                    customer.address,
                    customer.postcode,
                    customer.country,
                    customer.city
                );

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.onclick = () => deleteCustomer(customer.id);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            customerList.appendChild(row);
        });

        // Update Customer Count
        const customerCount = getElement('customer-count');
        if (customerCount) customerCount.innerText = customers.length.toString();
    } catch (error) {
        console.error('Failed to fetch customers:', error.message);
        alert('Failed to fetch customers. Please check the server connection.');
    }
}

// 📝 Open Add Customer Modal
function openCustomerModal() {
    const fields = [
        'customer-id',
        'customer-username',
        'customer-email',
        'customer-name',
        'customer-contact',
        'customer-address',
        'customer-postcode',
        'customer-country',
        'customer-city'
    ];

    fields.forEach((id) => {
        const element = getElement(id);
        if (element) element.value = '';
    });

    const modalTitle = getElement('modal-title');
    if (modalTitle) modalTitle.innerText = 'Add Customer';

    const modal = getElement('customer-modal');
    if (modal) modal.style.display = 'flex';
}

// 📝 Open Edit Customer Modal
function openEditCustomerModal(id, username, name, email, contact, address, postcode, country, city) {
    const customerData = {
        'customer-id': id,
        'customer-username': username,
        'customer-email': email,
        'customer-name': name,
        'customer-contact': contact,
        'customer-address': address,
        'customer-postcode': postcode,
        'customer-country': country,
        'customer-city': city
    };

    Object.entries(customerData).forEach(([key, value]) => {
        const element = getElement(key);
        if (element) element.value = value || '';
    });

    const modalTitle = getElement('modal-title');
    if (modalTitle) modalTitle.innerText = 'Edit Customer';

    const modal = getElement('customer-modal');
    if (modal) modal.style.display = 'flex';
}

// 📝 Close Modal
function closeCustomerModal() {
    const modal = getElement('customer-modal');
    if (modal) modal.style.display = 'none';

    const form = getElement('customer-form');
    if (form) form.reset();
}

// 📝 Save Customer (Add or Update)
async function saveCustomer(event) {
    event.preventDefault();

    const id = getElement('customer-id')?.value.trim();
    const payload = {
        username: getElement('customer-username')?.value.trim(),
        name: getElement('customer-name')?.value.trim(),
        email: getElement('customer-email')?.value.trim(),
        contact: getElement('customer-contact')?.value.trim(),
        address: getElement('customer-address')?.value.trim(),
        postcode: getElement('customer-postcode')?.value.trim(),
        country: getElement('customer-country')?.value.trim(),
        city: getElement('customer-city')?.value.trim()
    };

    // Validate Required Fields
    if (!payload.username || !payload.name || !payload.email || !payload.contact || !payload.address) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        let url = 'http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/admin/add_customer.php';
        let method = 'POST';

        if (id) {
            url = `http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/admin/update_customer.php?id=${id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        alert(result.message || 'Customer saved successfully');
        closeCustomerModal();
        fetchCustomers();
    } catch (error) {
        console.error('Failed to save customer:', error.message);
        alert(`Failed to save customer: ${error.message}`);
    }
}

// 📝 Initialize Event Listeners
const customerForm = getElement('customer-form');
if (customerForm) customerForm.addEventListener('submit', saveCustomer);

fetchCustomers();
