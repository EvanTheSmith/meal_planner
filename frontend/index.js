const HOST_URL = "http://localhost:3000"
const MEALS_URL = `${HOST_URL}/meals/`

const MEALS_ROW = document.getElementById("meals_go_here");
const ITEMS_ROW = document.getElementById("items_go_here");

// The Class
class Meal {
    constructor(name, items) {
      this.name = name;
      this.items = items;
    }

    countCalories() {
     let calorieArray = [];
     let reduceAlgo = (a, b) => a + b;
     for (let one of this.items) { calorieArray.push(one.calories); }
     return calorieArray.reduce(reduceAlgo, 0);
    }
}

// This starts filling the page when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => { fetchFood(); });

// Initial fetch request needed to get data for rendering the page
function fetchFood() {
fetch(MEALS_URL)
.then(response => response.json())
.then(data => renderMealsAndItems(data)); // Feed that data into my rendering function
}

// This function will render Meals and their respective Items
function renderMealsAndItems(theMeals) {
    for (meal of theMeals) { // Render Meals
        let new_meal = new Meal(meal.name, meal.items);
        let meal_TH = document.createElement("th");
        meal_TH.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
        MEALS_ROW.appendChild(meal_TH);

        let items_TD = document.createElement("td"); ITEMS_ROW.appendChild(items_TD);
        let itemsTable = document.createElement("table"); // table for all this Meal's items
        
        for (item of new_meal.items) { // Render Items for this Meal to the new table
            let itemAttr = document.createElement("tr"); // a row for all this item's attributes
            let itemName = document.createElement("td"); itemName.innerText = item.name;
            let itemKind = document.createElement("td"); itemKind.innerText = item.kind;
            let itemCalories = document.createElement("td"); itemCalories.innerText = item.calories+" calories";
            itemAttr.appendChild(itemName); itemAttr.appendChild(itemKind); itemAttr.appendChild(itemCalories); itemsTable.appendChild(itemAttr);
            // ^ this row attaches all the attributes
        }
        items_TD.appendChild(itemsTable);
    }
}

// Function for counting the calories of a given meal
function countCalories(meal) {
    let calorieArray = [];
    let reduceAlgo = (a, b) => a + b;
    for (item of meal.items) { calorieArray.push(item.calories); }
    return calorieArray.reduce(reduceAlgo, 0);
}