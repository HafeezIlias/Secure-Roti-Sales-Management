async function fetchSalesReport() {
    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/fetch_sales_report.php');
        const data = await response.json();

        // Update Metrics
        document.getElementById('total-sales').innerText = `RM${data.total_sales || 0}`;
        document.getElementById('top-product').innerText = data.top_product || 'N/A';
        document.getElementById('total-transactions').innerText = data.total_transactions || 0;

        // Update Chart
        const ctx = document.getElementById('salesReportChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.sales_trend.labels,
                datasets: [{
                    label: 'Sales Amount',
                    data: data.sales_trend.values,
                    borderWidth: 2
                }]
            }
        });

        // Update Table
        const salesTable = document.getElementById('sales-table');
        salesTable.innerHTML = '';

        data.sales_transactions.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.product}</td>
                <td>${sale.category}</td>
                <td>RM${sale.amount}</td>
                <td>${sale.date}</td>
            `;
            salesTable.appendChild(row);
        });

        // Store sales data for CSV export
        window.salesData = data.sales_transactions;

    } catch (error) {
        console.error('Failed to fetch sales report:', error.message);
    }
}

// Export Sales Data to CSV
function exportToCSV() {
    if (!window.salesData || window.salesData.length === 0) {
        alert('No sales data available to export.');
        return;
    }

    let csvContent = 'ID,Product,Category,Amount,Date\n';

    window.salesData.forEach(sale => {
        const row = [
            sale.id,
            `"${sale.product}"`,
            `"${sale.category}"`,
            sale.amount,
            sale.date
        ].join(',');

        csvContent += row + '\n';
    });

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function applySalesFilter() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const category = document.getElementById('category').value;

    console.log('Applying filters:', { startDate, endDate, category });
    fetchSalesReport();
}

// Initialize on load
fetchSalesReport();
