const HOST_URL = "http://localhost:3000"
const MEALS_URL = `${HOST_URL}/meals/`
const ITEMS_URL = `${HOST_URL}/items/`
const CALORIES_URL = `${HOST_URL}/items/calories`

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
    renderTotalCalories();
    let submitButton = document.getElementById("submit-button");
    submitButton.addEventListener('click', (event) => {
        let itemName = document.querySelector('input[name="name"]');
        let itemCalories = document.querySelector('input[name="calories"]');
        let itemKind; document.querySelector('input[name="item_kind"]').checked ? itemKind="food" : itemKind="drink";
        let itemMeal = document.querySelector('select');
        if (submit_type=="create") {
            submitNewItem(itemName.value, itemCalories.value, itemKind, itemMeal.value);
        } else { 
            submitedEditedItem(itemName.id, itemName.value, itemCalories.value, itemKind, itemMeal.value);
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
    let meal_TH = document.createElement("th");
    // meal_TH.setAttribute('id', "meal_"+new_meal.id);
    meal_TH.setAttribute('meal-id', new_meal.id);
    meal_TH.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
    MEALS_ROW.appendChild(meal_TH);

    let items_TD = document.createElement("td");
    ITEMS_ROW.appendChild(items_TD);
    let itemsTable = document.createElement("table");
    itemsTable.setAttribute('id', "table_"+new_meal.name);
    itemsTable.setAttribute('meal-id', new_meal.id);
    items_TD.appendChild(itemsTable);
    return itemsTable; // The table for all this meal's items
}

function createItem(item, itemsTable) { // this creates the node for a meal and appends it to MEALS_ROW
    let itemNode = document.createElement("tr"); // a row for all this item's attributes
    itemNode.setAttribute("edit-id", "none");
    let itemName = document.createElement("td"); itemName.innerText = item.name; itemName.setAttribute('id', item.id)
    let itemKind = document.createElement("td"); itemKind.innerText = item.kind;
    let itemCalories = document.createElement("td"); itemCalories.innerText = item.calories+" calories";

    let ediButton = document.createElement("td"); ediButton.id = "edit"; ediButton.innerText = "EDIT";
    ediButton.addEventListener("click", function() {editButton(itemNode, item)});

    let delButton = document.createElement("td"); delButton.id = "delete"; delButton.innerText = "DELETE";
    delButton.addEventListener("click", function() {deleteItem(itemNode, item)});

    itemNode.appendChild(itemName); itemNode.appendChild(itemKind); itemNode.appendChild(itemCalories); itemNode.appendChild(ediButton); itemNode.appendChild(delButton);
    itemsTable.appendChild(itemNode);
}

function editItem(item, itemsTable) { // this edits an existing node, moving it to a new table if necessary
    console.log(item);
    console.log(itemsTable);

}

// Create Item Function (after clicking Submit Button)
function submitNewItem(itemName, itemCalories, itemKind, itemMeal) {
   let formData = { name: itemName, calories: itemCalories, kind: itemKind, meal: itemMeal };
   let itemsTable = document.querySelector('#table_'+itemMeal);
   let configuration = { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(formData) };

   fetch(ITEMS_URL, configuration)
   .then(response => response.json())
   .then(function(food) {
    if(food.id) {
        createItem(food, itemsTable);
        refreshCalories();
        resetForm();
    } else {window.alert("Error(s): "+food);}
    });
}

// Edit Button function (EDIT)
function editButton(element, item) {
    submit_type = "edit";
    element.setAttribute("edit-id", "edit");
    document.querySelector("p#form-text").innerText = "Edit your meal item below:";
    let itemID = element.querySelector('td').id;
    document.querySelector('input[name="submit"]').value = "Edit";
    fetch(ITEMS_URL+itemID).then(response => response.json()).then(function(item) {
        // Update Form Values from Database Object
        document.querySelector('input[name="name"]').value = item.name;
        document.querySelector('input[name="name"]').id = itemID;
        document.querySelector('input[name="calories"]').value = item.calories;
        let radioBtn = document.querySelectorAll('input[name="item_kind"]');
        if(item.kind=="food") {radioBtn[0].checked = true;} else {radioBtn[1].checked = true;}
        document.querySelector('select').value = item.meal.name;
      // Prevent multiple cancel buttons from being made
        if (!document.getElementById("cancel-button")) {
        let cancelButton = document.createElement("input"); cancelButton.type="submit"; cancelButton.value="Cancel"; cancelButton.id="cancel-button";
        INPUT_FORM.appendChild(cancelButton);
        cancelButton.addEventListener('click', (event) => { event.preventDefault(); resetForm(); cancelButton.remove(); });
        }
    });
}

// Edit Item Function (after clicking Edit Button)
function submitedEditedItem(itemID, itemName, itemCalories, itemKind, itemMeal) {
    let formData = { name: itemName, calories: itemCalories, kind: itemKind, meal: itemMeal };
    let NEWitemsTable = document.querySelector('#table_'+itemMeal);
    let configuration = { method: "PATCH", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(formData) };

    fetch(ITEMS_URL+itemID, configuration)
    .then(response => response.json())
    .then(function(food) {
        if(food.id) {
            editItem(food, NEWitemsTable);
            refreshCalories();
            resetForm();
        } else {window.alert("Error(s): "+food);}
    });
}

// Delete Item function
function deleteItem(element, item) {
    element.remove();
    fetch(ITEMS_URL + item.id, {method: 'DELETE'})
    .then( () => refreshCalories() )
    resetForm();
}

function resetForm() {
    submit_type = "create";
    document.querySelector('input[name="submit"]').value = "Submit";
    document.querySelector("p#form-text").innerText = "Add a new meal item below:";
    document.querySelector('input[name="name"]').value = "";
    document.querySelector('input[name="name"]').id = "0";
    document.querySelector('input[name="calories"]').value = "";
    document.querySelector('select').value = "Breakfast";
    document.querySelector('input[name="item_kind"]').checked = true;
    document.querySelector('[edit-id="edit"]').setAttribute("edit-id", "none");
}

function refreshCalories() {
    fetch(MEALS_URL)
    .then(response => response.json())
    .then(function(meals) {
        for (let meal of meals) {
            let new_meal = new Meal(meal.name, meal.items, meal.id);
            let theNode = document.querySelector('[meal-id'+'="'+new_meal.id+'"]');
            theNode.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
        }
    } );
    renderTotalCalories()
}

function renderTotalCalories() {
    fetch(CALORIES_URL)
    .then(response => response.json())
    .then(function(calOBJ) { 
        let calBox = document.getElementById("total-calories");
        calBox.innerText = "Total Calories: "+calOBJ.calories;
    });
}