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
        let meal_TH = document.createElement("th");
        let mealCalories = countCalories(meal.items);
        meal_TH.innerText = meal.name + " - "+mealCalories+" calories";
        mealsRow.appendChild(meal_TH);

        let items_TD = document.createElement("td"); itemsRow.appendChild(items_TD);
        let itemsTable = document.createElement("table"); // table for all this Meal's items
        
        for (item of meal.items) { // Render Items for this Meal to the new table
            let itemAttr = document.createElement("tr"); // a row for all this item's attributes
            let itemName = document.createElement("td"); itemName.innerText = item.name;
            let itemKind = document.createElement("td"); itemKind.innerText = item.kind;
            let itemCalories = document.createElement("td"); itemCalories.innerText = item.calories+" calories";
            itemAttr.appendChild(itemName); itemAttr.appendChild(itemKind); itemAttr.appendChild(itemCalories);
            itemsTable.appendChild(itemAttr); // < ^ these two rows attach all the attributes
        }
        items_TD.appendChild(itemsTable);
    }
}

function countCalories(mealItems) {
    let calorieArray = [];
    let reduceAlgo = (accumulator, currentValue) => accumulator + currentValue;
    for (item of mealItems) { calorieArray.push(item.calories); }
    return calorieArray.reduce(reduceAlgo, 0);
}

})