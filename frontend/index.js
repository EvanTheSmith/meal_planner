document.addEventListener('DOMContentLoaded', () => {

let mealsRow = document.getElementById("meals_go_here"); // Meals Row 
let itemsRow = document.getElementById("items_go_here"); // Items Row

// Initial fetch request needed to get data for rendering the page
fetch('http://localhost:3000/meals')
.then(response => response.json())
.then(data => renderMeals(data));

function renderMeals(theMeals) {
    // This function will render the meals and their respective items into the table rows
    for (meal of theMeals) {
        let mealColumn = document.createElement("th"); // create Header Column for a Meal
        mealsRow.appendChild(mealColumn); // Attach new column to Meals Row
    }
}

})