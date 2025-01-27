document.getElementById('exportBtn').addEventListener('click', () => {
    const id=parseInt(ID);
    window.location.href = `http://localhost:4000/export-excel?id=${id}&startDate=${StartDate}&endDate=${EndDate}`;
});


document.getElementById('incomeBtn').addEventListener('click', () => {
    const id=parseInt(ID);
    window.location.href = `http://localhost:4000/export-excel-income?id=${id}&startDate=${StartDate}&endDate=${EndDate}`;
});