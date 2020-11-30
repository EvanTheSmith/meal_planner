const HOST_URL = "http://localhost:3000"
const MEALS_URL = `${HOST_URL}/meals/`
const ITEMS_URL = `${HOST_URL}/items/`

const MEALS_ROW = document.getElementById("meals_go_here");
const ITEMS_ROW = document.getElementById("items_go_here");

// The Class
class Meal {
    constructor(name, items, id) {
      this.name = name;
      this.items = items;
      this.id = id;
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

// This function will perform the initial rendering of Meals and their respective Items
function renderMealsAndItems(theMeals) {
    for (meal of theMeals) { // Render Meals
        let itemsTable = createMeal(meal); // Creates a meal and returns a table for items to be appended to
        
        for (item of meal.items) { // Render Items for this Meal to the new table
            createItem(item, itemsTable);
        }
        
    }
}

function createMeal(meal) { // this creates the node for a meal and appends it to MEALS_ROW
    let new_meal = new Meal(meal.name, meal.items, meal.id);
    let meal_TH = document.createElement("th"); meal_TH.setAttribute('meal-id', "meal_"+new_meal.id);
    meal_TH.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
    MEALS_ROW.appendChild(meal_TH);

    let items_TD = document.createElement("td");
    ITEMS_ROW.appendChild(items_TD);
    let itemsTable = document.createElement("table"); 
    items_TD.appendChild(itemsTable);
    return itemsTable; // The table for all this meal's items
}

function createItem(item, itemsTable) { // this creates the node for a meal and appends it to MEALS_ROW
    let itemNode = document.createElement("tr"); // a row for all this item's attributes
    let itemName = document.createElement("td"); itemName.innerText = item.name;
    let itemKind = document.createElement("td"); itemKind.innerText = item.kind;
    let itemCalories = document.createElement("td"); itemCalories.innerText = item.calories+" calories";
    let delButton = document.createElement("td"); delButton.innerText = "DELETE";
    delButton.addEventListener("click", deleteItem(itemNode, item));
    itemNode.appendChild(itemName); itemNode.appendChild(itemKind); itemNode.appendChild(itemCalories); itemNode.appendChild(delButton);
    itemsTable.appendChild(itemNode);
}

function deleteItem(element, item) {
    element.remove();
    fetch(ITEMS_URL + item.id, {method: 'DELETE'});
}