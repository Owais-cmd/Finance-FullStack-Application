const selector=document.querySelectorAll(".delete");
selector.forEach((deleteButton)=>{
    deleteButton.addEventListener('click',()=>{
        var object=document.querySelectorAll(".not");
        object.forEach((e)=>{
            e.classList.toggle("notShown");  
        })
    })
})


document.querySelectorAll(".noCss").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
        // Submit the form when the checkbox is checked
        if (event.target.checked) {
            event.target.closest("form").submit();
        }
    });
});