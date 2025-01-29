const API_BASE_URL = "https://finance-fullstack-application.onrender.com";


document.getElementById('exportBtn').addEventListener('click', () => {
    const id=parseInt(ID);
    window.location.href = `${API_BASE_URL}/export-excel?id=${id}&startDate=${StartDate}&endDate=${EndDate}`;
});


document.getElementById('incomeBtn').addEventListener('click', () => {
    const id=parseInt(ID);
    window.location.href = `${API_BASE_URL}/export-excel-income?id=${id}&startDate=${StartDate}&endDate=${EndDate}`;
});