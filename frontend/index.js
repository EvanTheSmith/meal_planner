const HOST_URL = "http://localhost:3000"
const MEALS_URL = `${HOST_URL}/meals/`
const ITEMS_URL = `${HOST_URL}/items/`
const CALORIES_URL = `${HOST_URL}/items/calories`
const header_object = { "Content-Type": "application/json", "Accept": "application/json" }

let submit_type = "create";

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

// AFTER PAGE IS LOADED, (1) Render Page, (2) Render total calories, (3) Setup Submit/Edit Button

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

///////////////////////////////
// INITIAL RENDERING OF PAGE //
///////////////////////////////

function firstRender() {
fetch(MEALS_URL)
.then(response => response.json())
.then(meals => renderMealsAndItems(meals));
}

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

    let menu_item = document.createElement("option"); // Populate the drop-down box of the form
    menu_item.value = menu_item.innerText = new_meal.name;
    document.querySelector("select").appendChild(menu_item);

    let meal_TH = document.createElement("th"); // The header for this meal
    meal_TH.setAttribute('meal-id', new_meal.id);
    meal_TH.innerText = new_meal.name + " - "+new_meal.countCalories()+" calories";
    MEALS_ROW.appendChild(meal_TH); // append this TH to the global meals row

    let items_TD = document.createElement("td");
    ITEMS_ROW.appendChild(items_TD); // append this TD to the global items row
    let itemsTable = document.createElement("table");
    itemsTable.setAttribute('id', "table_"+new_meal.name);
    itemsTable.setAttribute('meal-id', new_meal.id);
    items_TD.appendChild(itemsTable);
    return itemsTable; // The table for all this meal's items
}

function createItem(item, itemsTable) { // this creates the node for an item and appends it to itemsTable
    let itemNode = document.createElement("tr"); // a row for all this item's attributes

    itemNode.setAttribute("edit-id", "none"); // sets up an edit attribute which will be used if the item is ever edited

    let itemName = document.createElement("td"); itemName.innerText = item.name; itemName.setAttribute('id', item.id)
    let itemKind = document.createElement("td"); itemKind.innerText = item.kind;
    let itemCalories = document.createElement("td"); itemCalories.innerText = item.calories+" calories";

    let ediButton = document.createElement("td"); ediButton.id = "edit"; ediButton.innerText = "EDIT";
    ediButton.addEventListener("click", function() {editButton(itemNode, item)});

    let delButton = document.createElement("td"); delButton.id = "delete"; delButton.innerText = "DELETE";
    delButton.addEventListener("click", function() {deleteItem(itemNode, item)});

    itemNode.appendChild(itemKind); // append all the things
    itemNode.appendChild(itemName); 
    itemNode.appendChild(itemCalories); 
    itemNode.appendChild(ediButton); 
    itemNode.appendChild(delButton); 

    itemsTable.appendChild(itemNode);
}

///////////////////////////////
//// CLICKING SUBMIT BUTTON ///
///////////////////////////////

function submitNewItem(name, calories, kind, meal) {
   event.preventDefault();

   let formData = { name, calories, kind, meal }; // building object using ES6 "name: name === name" convention
   let itemsTable = document.querySelector('#table_'+meal);
   let configuration = { method: "POST", headers: header_object, body: JSON.stringify(formData) };

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

////////////////////
// EDIT FUNCTIONS //
////////////////////

function editButton(element, item) {
    submit_type = "edit";
    element.setAttribute("edit-id", "edit");
    document.querySelector("h2#form-text").innerText = "Edit your meal item below:";
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
        let cancel = document.createElement("input"); cancel.type="submit"; cancel.value="Cancel"; cancel.id="cancel-button";
        document.querySelector("#meal-form").appendChild(cancel);
        cancel.addEventListener('click', (event) => { event.preventDefault(); resetForm(); cancel.remove(); });
        }
    });
}

// WHEN EDIT BUTTON IS CLICKED
function submitedEditedItem(itemID, itemName, itemCalories, itemKind, itemMeal) {
    document.getElementById("cancel-button").remove();
    let formData = { name: itemName, calories: itemCalories, kind: itemKind, meal: itemMeal };
    let NEWitemsTable = document.querySelector('#table_'+itemMeal);
    let configuration = { method: "PATCH", headers: header_object, body: JSON.stringify(formData) };

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

function editItem(item, itemsTable) { 
    let editNode = document.querySelector('[edit-id="edit"]');
    editNode.childNodes[0].innerText = item.name;
    editNode.childNodes[1].innerText = item.kind;
    editNode.childNodes[2].innerText = item.calories+" calories";
    itemsTable.appendChild(editNode); // this ensures if the meal changed, the item changes columns
}

//////////////////////
// DELETE FUNCTIONS //
//////////////////////

function deleteItem(element, item) {
    element.remove();
    fetch(ITEMS_URL + item.id, {method: 'DELETE'})
    .then( () => refreshCalories() )
    resetForm();
}

////////////////////////////
// REFRESH PAGE FUNCTIONS //
////////////////////////////

function resetForm() {
    submit_type = "create";
    document.querySelector('input#submit-button').value = "Submit";
    document.querySelector("h2#form-text").innerText = "Add a new meal item below:";
    document.querySelector('input.text-input').value = "";
    document.querySelector('input.text-input').id = "0";
    document.querySelector('input[name="calories"]').value = "";
    document.querySelector('select#meal').value = "Breakfast";
    document.querySelector('input#food').checked = true;
    let ed = document.querySelector('[edit-id="edit"]'); if (ed) {ed.setAttribute("edit-id", "none");}
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

function renderTotalCalories() { // also used to render total calories on 1st page load
    fetch(CALORIES_URL)
    .then(response => response.json())
    .then(function(calOBJ) { 
        let calBox = document.getElementById("total-calories");
        calBox.innerText = "Total Calories: "+calOBJ.calories;
    });
}

function deleteAll() {
    event.preventDefault();
    let choice = confirm("Are you sure you want to delete all items?");
    if (choice == true) {
        let theNodes = document.querySelectorAll('[edit-id]');
        for (oneNode of theNodes) {
            let itemID = parseInt(oneNode.querySelector("td").id);
            fetch(ITEMS_URL + itemID, {method: 'DELETE'}).then( () => refreshCalories()) // delete in database
            oneNode.remove(); // delete in DOM
        }
    }
}