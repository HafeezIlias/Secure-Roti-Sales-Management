let salesChart = null; // Global variable for the Chart instance

// 📝 Fetch Sales Report Data
async function fetchSalesReport() {
    try {
        const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/salesAdvisor/fetch_sales_report.php');
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();

        updateMetrics(data);
        updateChart(data.sales_trend);
        updateSalesTable(data.sales_transactions);
        storeSalesData(data.sales_transactions);
    } catch (error) {
        console.error('Failed to fetch sales report:', error.message);
        alert('Failed to load sales report. Please try again later.');
    }
}

// 📝 Update Metrics Display
function updateMetrics(data) {
    document.getElementById('total-sales').innerText = `RM${data.total_sales || 0}`;
    document.getElementById('top-product').innerText = data.top_product || 'N/A';
    document.getElementById('total-transactions').innerText = data.total_transactions || 0;
}

// 📊 Update Sales Chart
function updateChart(salesTrend) {
    const ctx = document.getElementById('salesReportChart').getContext('2d');
    if (salesChart) {
        salesChart.destroy();
    }
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesTrend.labels,
            datasets: [{
                label: 'Sales Amount',
                data: salesTrend.values,
                borderWidth: 2
            }]
        }
    });
}

// 📋 Update Sales Table
function updateSalesTable(salesTransactions) {
    const salesTable = document.getElementById('sales-table');
    salesTable.innerHTML = ''; // Clear the table before rendering

    if (salesTransactions.length === 0) {
        salesTable.innerHTML = `<tr><td colspan="6" class="text-center">No sales data available</td></tr>`;
        return;
    }

    salesTransactions.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.product_name || 'N/A'}</td>
            <td>${sale.customer_id || 'N/A'}</td>
            <td>RM${sale.amount}</td>
            <td>${sale.date}</td>
            <td>${sale.payment_method || 'N/A'}</td>
        `;
        salesTable.appendChild(row);
    });
}


// 💾 Store Sales Data for CSV Export
function storeSalesData(salesTransactions) {
    window.salesData = salesTransactions;
}

// 📤 Export Sales Data to CSV
function exportToCSV() {
    if (!window.salesData || window.salesData.length === 0) {
        alert('No sales data available to export.');
        return;
    }

    let csvContent = 'ID,Product Name,Customer ID,Amount,Date,Payment Method\n';

    window.salesData.forEach(sale => {
        const row = [
            sale.id,
            `"${sale.product_name || 'N/A'}"`,
            `"${sale.customer_id || 'N/A'}"`,
            `RM${sale.amount}`,
            sale.date,
            sale.payment_method || 'N/A'
        ].join(',');

        csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// 📆 Apply Filters to Sales Report
async function applySalesFilter() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);

    try {
        const response = await fetch(`http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/salesAdvisor/fetch_sales_report.php?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();

        updateMetrics(data);
        updateChart(data.sales_trend);
        updateSalesTable(data.sales_transactions);
        storeSalesData(data.sales_transactions);
    } catch (error) {
        console.error('Failed to fetch filtered sales report:', error.message);
        alert('Failed to apply filters. Please try again later.');
    }
}

// 🚀 Initialize on Page Load
fetchSalesReport();
