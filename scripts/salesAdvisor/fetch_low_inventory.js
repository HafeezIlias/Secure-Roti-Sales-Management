async function fetchLowInventory() {
    const lowInventoryElement = document.getElementById('low-inventory-count');
    lowInventoryElement.innerText = 'Loading...';

    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/salesAdvisor/fetch_low_inventory.php');
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', data.error);
            lowInventoryElement.innerText = 'Failed to fetch low inventory count.';
            return;
        }

        const lowStockCount = data.low_stock_count || 0;
        lowInventoryElement.innerText = `${lowStockCount}`;
    } catch (error) {
        console.error('Error fetching low inventory count:', error.message);
        lowInventoryElement.innerText = 'Failed to load low inventory count.';
    }
}

// Fetch Low Inventory Count on Page Load
fetchLowInventory();
