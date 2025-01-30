document.getElementById('exportBtn').addEventListener('click', () => {
    const id=parseInt(ID);
    window.location.href = `${api}/export-excel?id=${id}&startDate=${StartDate}&endDate=${EndDate}`;
});


document.getElementById('incomeBtn').addEventListener('click', () => {
    const id=parseInt(ID);
    window.location.href = `${api}/export-excel-income?id=${id}&startDate=${StartDate}&endDate=${EndDate}`;
});