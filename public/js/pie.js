// Ensure axios is included if not via CDN in HTML or npm installed
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>




async function renderChart1() {
    try {
        const id=parseInt(ID);

        
        const result = await axios.get(`http://localhost:4000/stats1?id=${id}&startDate=${StartDate}&endDate=${EndDate}`);
        
        
         // Debugging

        // Prepare Chart.js Data
        const ctx = document.getElementById('expenseChart').getContext('2d');
        const expenseData = {
            labels: ['Food', 'Transport', 'Rent', 'Entertainment', 'Others'],
            datasets: [{
                label: 'Expenses Breakdown',
                data: [
                    result.data.Foods,
                    result.data.Transports,
                    result.data.Rents,
                    result.data.Entertain,
                    result.data.Others
                ],
                backgroundColor: [ 
                    '#FF6384', // Food - Red
                    '#36A2EB', // Transport - Blue
                    '#FFCE56', // Rent - Yellow
                    '#4BC0C0', // Entertainment - Teal
                    '#9966FF'  // Others - Purple
                ],
                hoverOffset: 5
            }]
        };

        // Render Chart
        new Chart(ctx, {
            type: 'doughnut',
            data: expenseData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Your Monthly Expenses'
                    }
                }
            }
        });
    } catch (err) {
        console.error("Error fetching chart data:", err);
    }
}


async function renderChart2() {
    try {
        // Fetch data from backend
        const id=parseInt(ID);
        const result = await axios.get(`http://localhost:4000/stats2?id=${id}&startDate=${StartDate}&endDate=${EndDate}`);
        
        

        // Prepare Chart.js Data
        const ctx = document.getElementById('exVSinChart').getContext('2d');
        const expense_incomeData = {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Finance Breakdown',
                data: [
                    
                    result.data.Income,
                    result.data.Expense,
                    
                ],
                backgroundColor: [ 
                    '#074799', 
                    'rgb(216, 230, 32)', 
                     
                ],
                hoverOffset: 5
            }]
        };

        // Render Chart
        new Chart(ctx, {
            type: 'pie',
            data: expense_incomeData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Financial Breakdown'
                    }
                }
            }
        });
    } catch (err) {
        console.error("Error fetching chart data:", err);
    }
}

// Call the function
renderChart1();
renderChart2();
