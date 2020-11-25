document.addEventListener('DOMContentLoaded', () => {

let theMeals = document.getElementById("meals_go_here"); // Meals Row 
let theItems = document.getElementById("items_go_here"); // Items Row

// Initial fetch request needed to get data for rendering the page
fetch('http://localhost:3000/meals')
.then(response => response.json())
.then(data => renderMeals(data));

function renderMeals(theMeals) {
    // This function will render the meals and their respective items into the table rows
}

})