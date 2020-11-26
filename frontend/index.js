document.addEventListener('DOMContentLoaded', () => {

let mealsRow = document.getElementById("meals_go_here"); // Meals Row 
let itemsRow = document.getElementById("items_go_here"); // Items Row

// Initial fetch request needed to get data for rendering the page
fetch('http://localhost:3000/meals')
.then(response => response.json())
.then(data => renderMealsAndItems(data));

// This function will render Meals and their respective Items
function renderMealsAndItems(theMeals) {
    for (meal of theMeals) { // Render Meals
        let meal_TH = document.createElement("th"); // create TH for this Meal
        meal_TH.innerText = meal.name;
        mealsRow.appendChild(meal_TH); // Attach the meal's TH to Meals Row

        let items_TD = document.createElement("td"); // create TD for all this Meal's items
        itemsRow.appendChild(items_TD); // Append this TD to the Items Row
        let itemsTable = document.createElement("table"); // create a table for all this Meal's items
        
        for (item of meal.items) { // Render Items for this Meal
            let itemName = document.createElement("tr"); itemName.innerText = item.name;
            itemsTable.appendChild(itemName);
            items_TD.appendChild(itemsTable);
        }
    }
}

})