const HOST_URL = "http://localhost:3000"
const MEALS_URL = `${HOST_URL}/meals/`
const ITEMS_URL = `${HOST_URL}/items/`
const CALORIES_URL = `${HOST_URL}/items/calories`
const header_object = { "Content-Type": "application/json", "Accept": "application/json" }

let submit_type = "create";

const MEALS_ROW = document.getElementById("meals_go_here");
const ITEMS_ROW = document.getElementById("items_go_here");

// Form Values
const FORM_NAME = document.querySelector('input[name="name"]');
const FORM_RADIO = document.querySelectorAll('input[name="item_kind"]');
const FORM_CALORIES = document.querySelector('input[name="calories"]');
const FORM_MEAL = document.querySelector('select');

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
        event.preventDefault();
        let itemName = document.querySelector('input[name="name"]');
        let itemCalories = document.querySelector('input[name="calories"]');
        let itemKind; document.querySelector('input[name="item_kind"]').checked ? itemKind="food" : itemKind="drink";
        let itemMeal = document.querySelector('select');
        if (submit_type=="create") {
            submitNewItem(itemName.value, itemCalories.value, itemKind, itemMeal.value);
        } else { 
            submitedEditedItem(itemName.id, itemName.value, itemCalories.value, itemKind, itemMeal.value);
        }
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
    meal_TH.innerText = new_meal.name + ": "+new_meal.countCalories()+" calories";
    MEALS_ROW.appendChild(meal_TH); // append this TH to the global meals row

    let itemsTable = document.createElement("td");
    itemsTable.setAttribute('id', "table_"+new_meal.name);
    itemsTable.setAttribute('meal-id', new_meal.id);
    itemsTable.className = 'items_table';
    ITEMS_ROW.appendChild(itemsTable); // *NEW*
    return itemsTable; // The table for all this meal's items
}


function createItem(item, itemsTable) { // this creates the node for an item and appends it to itemsTable
    let itemNode = document.createElement("div"); // a box for all this item's attributes
    itemNode.setAttribute("edit-id", "none"); // sets up an edit attribute which will be used if the item is ever edited
    itemNode.setAttribute('id', item.id); // ensure each item has a unique ID
    itemNode.className = "meal_row"; // for styling

    // setup the HTML using a template literal
    itemNode.innerHTML = `<table>
                            <tr>
                                <td> <img src="./res/${item.kind}.png" class="food-icon"></img> </td>
                                <td> ${item.name} <br /> ${item.calories} calories 
                                <div id="edit">edit</div> <div id="delete">delete</div> </td>
                            </tr>
                        </table>`;
    
    // edit/delete buttons
    let ediButton = itemNode.querySelector("#edit"); // select the edit button div from the innerHTML above
    ediButton.addEventListener("click", function() {editButton(itemNode, ediButton);});
    let delButton = itemNode.querySelector("#delete"); // select the delete button div from the innerHTML above
    delButton.addEventListener("click", function() {deleteItem(itemNode, item)});

    // append everything
    itemsTable.appendChild(itemNode); // put it on the table
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

function clearEdits() { // reverts any selected edit buttons
    let all_the_buttons = document.querySelectorAll('#edit_selected');
    for (const one of all_the_buttons) { one.id = "edit"; }

    let selected_node = document.querySelector('.selected_item');
    if (selected_node) selected_node.classList.remove("selected_item");
}

// WHEN AN ITEM IS CUED UP TO BEGIN EDITING
function editButton(element, button) {
    let ed = document.querySelector('[edit-id="edit"]'); 
    if (ed) ed.setAttribute("edit-id", "none"); // reset previous edit-id to none (if any)

    let formtext = document.getElementById("form-text").innerText;
    if (formtext == "Add a new meal item:") showArrow();

    clearEdits();
    button.id = "edit_selected"; // select THIS edit button

    element.classList.add("selected_item");

    submit_type = "edit";
    element.setAttribute("edit-id", "edit");
    document.querySelector("h3#form-text").innerText = "Edit your meal item below:";
    document.querySelector('input[name="submit"]').value = "Edit";
    fetch(ITEMS_URL+element.id).then(response => response.json()).then(function(item) {
        // Update Form Values from Database Object
        FORM_NAME.value = item.name;
        FORM_NAME.id = element.id;
        if(item.kind=="food") {FORM_RADIO[0].checked = true;} else {FORM_RADIO[1].checked = true;}
        FORM_CALORIES.value = item.calories;
        FORM_MEAL.value = item.meal.name;

        if (!document.getElementById("cancel-button")) { // Prevent multiple cancel buttons from being made
        let cancel = document.createElement("input"); cancel.type="submit"; cancel.value="Cancel"; cancel.id="cancel-button";
        document.querySelector("#meal-form").appendChild(cancel);
        cancel.addEventListener('click', (event) => { event.preventDefault(); clearEdits(); resetForm(); cancel.remove(); });
        }
    });
}

// WHEN EDIT IS COMPLETE
function submitedEditedItem(itemID, itemName, itemCalories, itemKind, itemMeal) {
    let selected_node = document.querySelector('div.selected_item');
    selected_node.classList.remove("selected_item");

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
    editNode.innerHTML = `<table><tr>
        <td> <img src="./res/${item.kind}.png" class="food-icon"></img> </td>
        <td> ${item.name} <br /> ${item.calories} calories 
        <div id="edit">edit</div> <div id="delete">delete</div> </td>
    </tr></table>`;

    // remake edit/delete buttons
    let ediButton = editNode.querySelector("#edit");
    ediButton.addEventListener("click", function() {editButton(editNode, ediButton);});
    let delButton = editNode.querySelector("#delete");
    delButton.addEventListener("click", function() {deleteItem(editNode, item)});

    itemsTable.appendChild(editNode); // this ensures if the meal changed, the item changes columns
}

//////////////////////
// DELETE FUNCTIONS //
//////////////////////

function deleteItem(element, item) {
    let choice = confirm(`Are you sure you want to delete ${item.name}?`);
    if (choice == true) {
        element.remove();
        fetch(ITEMS_URL + item.id, {method: 'DELETE'})
        .then( () => refreshCalories() )
        clearEdits();
        resetForm();
    }
}

////////////////////////////
// REFRESH PAGE FUNCTIONS //
////////////////////////////

function resetForm() {
    submit_type = "create";
    document.querySelector('input#submit-button').value = "Submit";
    document.querySelector("h3#form-text").innerText = "Add a new meal item:";
    document.querySelector('input.text-input').value = "";
    document.querySelector('input.text-input').id = "0";
    document.querySelector('input[name="calories"]').value = "";
    document.querySelector('select#meal').value = "Breakfast";
    document.querySelector('input#food').checked = true;
    let ed = document.querySelector('[edit-id="edit"]'); 
    if (ed) {ed.setAttribute("edit-id", "none");}
}

function refreshCalories() {
    fetch(MEALS_URL)
    .then(response => response.json())
    .then(function(meals) {
        for (let meal of meals) {
            let new_meal = new Meal(meal.name, meal.items, meal.id);
            let theNode = document.querySelector(`[meal-id="${new_meal.id}"]`);
            theNode.innerText = new_meal.name + ": "+new_meal.countCalories()+" calories";
        }
    } );
    renderTotalCalories()
}

function renderTotalCalories() { // also used to render total calories on 1st page load
    fetch(CALORIES_URL)
    .then(response => response.json())
    .then(function({calories}) { 
        let calBox = document.getElementById("total-calories");
        calBox.innerText = "Today's Calories: "+calories;
    });
}

function deleteAll() {
    event.preventDefault();
    let choice = confirm("WARNING! Are you sure you want to delete all items?");
    if (choice == true) {
        let theNodes = document.querySelectorAll('[edit-id]');
        for (oneNode of theNodes) {
            let itemID = parseInt(oneNode.querySelector("td").id);
            fetch(ITEMS_URL + itemID, {method: 'DELETE'}) // delete in database
            .then( () => refreshCalories()) // update calorie count in DOM
            oneNode.remove(); // delete in DOM
        }
    }
}

////////////////////////////
///// EXTRA FUNCTIONS //////
////////////////////////////

function showArrow() {
    const arrow = document.getElementById("arrow");
    arrow.style.display = "inline";
    setTimeout(() => {arrow.style.display = "none";}, "1000");
}