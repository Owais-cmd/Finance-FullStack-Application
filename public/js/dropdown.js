const mainSelect = document.getElementById('option');
const expenseOptions=document.getElementById('expenseOptionsContainer');
        const incomeOptions = document.getElementById('incomeOptionsContainer');

        // Event Listener on Main Select Dropdown
        mainSelect.addEventListener('change', function() {
            if (mainSelect.value == 'income') {
                incomeOptions.style.display = 'none';
                expenseOptions.style.display = 'none';
                incomeOptions.style.display = 'inline-block';
            } else if(mainSelect.value == 'expense') {
                incomeOptions.style.display = 'none';
                expenseOptions.style.display = 'none';
                expenseOptions.style.display = 'inline-block';
            }else{
                incomeOptions.style.display = 'none';
                expenseOptions.style.display = 'none';
            }
        });