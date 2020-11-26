document.addEventListener('DOMContentLoaded', () => {

let mealsRow = document.getElementById("meals_go_here"); // Meals Row 
let itemsRow = document.getElementById("items_go_here"); // Items Row

// Initial fetch request needed to get data for rendering the page
fetch('http://localhost:3000/meals')
.then(response => response.json())
.then(data => renderMeals(data));

// This function will render Meals and their respective Items
function renderMeals(theMeals) {
    // Render Meals first
    for (meal of theMeals) {
        let mealTH = document.createElement("th"); // create TH for this Meal
        mealTH.innerText = meal.name; // Name the meal
        mealsRow.appendChild(mealTH); // Attach the meal's TH to Meals Row

        let itemsTD = document.createElement("td"); // create TD for all this Meal's items
        itemsRow.appendChild(itemsTD); // Append this TD to the Items Row
        let itemsTable = document.createElement("table"); // create a table for all this Meal's items
        
        // Then Render those items
        for (item of meal.items) {
            let itemName = document.createElement("tr");
            itemName.innerText = item.name; // Name item
            itemsTable.appendChild(itemName);
            itemsTD.appendChild(itemsTable);
        }
    }
}

})