const HOST_URL = "http://localhost:3000"
const MEALS_URL = `${HOST_URL}/meals/`
const ITEMS_URL = `${HOST_URL}/items/`

let submit_type = "create";

const MEALS_ROW = document.getElementById("meals_go_here");
const ITEMS_ROW = document.getElementById("items_go_here");
const INPUT_FORM = document.querySelector("#meal-form");

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
document.addEventListener('DOMContentLoaded', () => { 
    firstRender(); 
    INPUT_FORM.addEventListener('submit', (event) => {
        let itemName = document.querySelector('input[name="name"]');
        let itemCalories = document.querySelector('input[name="calories"]');
        let itemKind; document.querySelector('input[name="item_kind"]').checked ? itemKind="food" : itemKind="drink";
        let itemMeal = document.querySelector('select');
        if (submit_type=="create") {
            submitNewItem(itemName.value, itemCalories.value, itemKind, itemMeal.value);
            itemName.value = ""; itemCalories.value = ""; itemMeal.value = "Breakfast";
            document.querySelector('input[name="item_kind"]') = checked;
        } else { 
            editItem(itemName.value, itemCalories.value, itemKind, itemMeal.value);
            submit_type="create";
        }
        event.preventDefault();
       });
});

// Initial fetch request and render trigger needed to get data for the page
function firstRender() {
fetch(MEALS_URL)
.then(response => response.json())
.then(meals => renderMealsAndItems(meals));
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
    let meal_TH = document.createElement("th"); meal_TH.setAttribute('id', "meal_"+new_meal.id);
    meal_TH.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
    MEALS_ROW.appendChild(meal_TH);

    let items_TD = document.createElement("td");
    ITEMS_ROW.appendChild(items_TD);
    let itemsTable = document.createElement("table"); itemsTable.setAttribute('id', "table_"+new_meal.name);
    items_TD.appendChild(itemsTable);
    return itemsTable; // The table for all this meal's items
}

function createItem(item, itemsTable) { // this creates the node for a meal and appends it to MEALS_ROW
    let itemNode = document.createElement("tr"); // a row for all this item's attributes
    let itemName = document.createElement("td"); itemName.innerText = item.name; itemName.setAttribute('item-id', item.id)
    let itemKind = document.createElement("td"); itemKind.innerText = item.kind;
    let itemCalories = document.createElement("td"); itemCalories.innerText = item.calories+" calories";

    let ediButton = document.createElement("td"); ediButton.id = "edit"; ediButton.innerText = "EDIT";
    ediButton.addEventListener("click", function() {editButton(itemNode, item)});

    let delButton = document.createElement("td"); delButton.id = "delete"; delButton.innerText = "DELETE";
    delButton.addEventListener("click", function() {deleteItem(itemNode, item)});

    itemNode.appendChild(itemName); itemNode.appendChild(itemKind); itemNode.appendChild(itemCalories); itemNode.appendChild(ediButton); itemNode.appendChild(delButton);
    itemsTable.appendChild(itemNode);
}

// Create Item function (Submit Button)
function submitNewItem(itemName, itemCalories, itemKind, itemMeal) {
   let formData = { name: itemName, calories: itemCalories, kind: itemKind, meal: itemMeal };
   let itemsTable = document.querySelector('#table_'+itemMeal);
   let configuration = { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(formData) };

   fetch(ITEMS_URL, configuration)
   .then(response => response.json())
   .then(food => createItem(food, itemsTable))
   .then(() => refreshCalories())
   .catch(error => console.log(error.message));
}

// Edit Button function (EDIT)
function editButton(element, item) {
    submit_type = "edit";
    document.querySelector("p#form-text").innerText = "Edit your meal item below:";
    console.log(element);
}

// Edit Item function (Submit Button)
function editItem(itemName, itemCalories, itemKind, itemMeal) {
    console.log("This will help edit an item soon");
}

// Delete Item function
function deleteItem(element, item) {
    element.remove();
    fetch(ITEMS_URL + item.id, {method: 'DELETE'})
    .then( () => refreshCalories() )
}

function refreshCalories() {
    fetch(MEALS_URL)
    .then(response => response.json())
    .then(function(meals) {
        for (let meal of meals) {
            let new_meal = new Meal(meal.name, meal.items, meal.id);
            let theNode = document.querySelector("th#meal_"+new_meal.id);
            theNode.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
        }
    } );
}