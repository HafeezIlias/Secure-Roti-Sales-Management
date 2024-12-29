async function fetchOrders() {
    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/fetch_order.php');
        const orders = await response.json();

        ['pending', 'fulfilled', 'cancelled'].forEach(status => {
            const list = document.getElementById(`${status}-orders`);
            list.innerText = ''; // Clear previous content

            const filteredOrders = orders.filter(order => order.status === status);

            if (filteredOrders.length === 0) {
                const noDataMessage = document.createElement('p');
                noDataMessage.innerText = `No ${status} orders.`;
                noDataMessage.style.textAlign = 'center';
                noDataMessage.style.color = 'gray';
                list.appendChild(noDataMessage);
                return;
            }

            filteredOrders.forEach(order => {
                // Create order card
                const orderCard = document.createElement('div');
                orderCard.className = `order-card ${status}`;

                // Create order details
                const orderDetails = document.createElement('div');
                orderDetails.className = 'order-details';

                const orderTitle = document.createElement('h5');
                orderTitle.innerText = `Order #${order.id}`;

                const orderDate = document.createElement('span');
                orderDate.innerText = `Date: ${order.order_date}`;

                const orderAmount = document.createElement('span');
                orderAmount.innerText = `Amount: RM${order.total_amount.toFixed(2)}`;

                orderDetails.appendChild(orderTitle);
                orderDetails.appendChild(orderDate);
                orderDetails.appendChild(orderAmount);

                // Create order actions
                const orderActions = document.createElement('div');
                orderActions.className = 'order-actions';

                const statusSelect = document.createElement('select');
                statusSelect.addEventListener('change', () => updateOrderStatus(order.id, statusSelect.value));

                ['pending', 'fulfilled', 'cancelled'].forEach(optionStatus => {
                    const option = document.createElement('option');
                    option.value = optionStatus;
                    option.innerText = optionStatus.charAt(0).toUpperCase() + optionStatus.slice(1);
                    if (order.status === optionStatus) {
                        option.selected = true;
                    }
                    statusSelect.appendChild(option);
                });

                orderActions.appendChild(statusSelect);

                // Append details and actions to order card
                orderCard.appendChild(orderDetails);
                orderCard.appendChild(orderActions);

                // Append order card to the list
                list.appendChild(orderCard);
            });
        });
    } catch (error) {
        console.error('Failed to fetch orders:', error.message);

        ['pending', 'fulfilled', 'cancelled'].forEach(status => {
            const list = document.getElementById(`${status}-orders`);
            list.innerText = 'Failed to load orders. Please try again later.';
        });
    }
}

async function updateOrderStatus(id, status) {
    try {
        const response = await fetch(`http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/update_order_status.php?id=${id}&status=${status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message || 'Order status updated successfully.');
        fetchOrders(); // Refresh the orders list
    } catch (error) {
        console.error('Failed to update order status:', error.message);
    }
}

// Initialize on load
fetchOrders();