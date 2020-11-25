document.addEventListener('DOMContentLoaded', () => {

let mealsRow = document.getElementById("meals_go_here"); // Meals Row 
let itemsRow = document.getElementById("items_go_here"); // Items Row

// Initial fetch request needed to get data for rendering the page
fetch('http://localhost:3000/meals')
.then(response => response.json())
.then(data => renderMeals(data));

// This function will render the meals and their respective items into the table rows
function renderMeals(theMeals) {
    for (meal of theMeals) {
        let mealColumn = document.createElement("th"); // create Header Column for a Meal
        mealColumn.innerText = meal.name; // Name meal
        mealsRow.appendChild(mealColumn); // Attach meal to Meals Row

    }
}

})