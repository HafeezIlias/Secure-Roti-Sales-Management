/**
 * Receipt Page Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
    const receiptDetails = document.getElementById('receipt-details');
    const printButton = document.getElementById('print-receipt');

    // Get order ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    if (!orderId) {
        receiptDetails.innerHTML = '<p class="text-danger">No order ID provided. Please check your link.</p>';
        return;
    }

    try {
        console.log(`Fetching receipt details for Order ID: ${orderId}`);
        const response = await fetch(`http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/guest/get_receipt.php?order_id=${orderId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch receipt: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        // Render receipt details
        renderReceipt(result);
    } catch (error) {
        console.error('Error fetching receipt:', error);
        receiptDetails.innerHTML = `<p class="text-danger">Failed to load receipt: ${error.message}</p>`;
    }

    /**
     * Render Receipt Details
     * @param {Object} data - Receipt data from the backend
     */
    function renderReceipt(data) {
        let itemsHTML = '';
        data.items.forEach(item => {
            itemsHTML += `
                <tr>
                    <td>${item.product_name}</td>
                    <td>RM${parseFloat(item.price).toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>RM${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        });

        receiptDetails.innerHTML = `
            <h5>Order ID: ${data.order_id}</h5>
            <p><strong>Date:</strong> ${data.order_date}</p>
            <p><strong>Total Amount:</strong> RM${parseFloat(data.total_amount).toFixed(2)}</p>
            <table class="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price (RM)</th>
                        <th>Quantity</th>
                        <th>Total (RM)</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        `;
    }

    // Print Receipt
    printButton.addEventListener('click', () => {
        window.print();
    });
});
