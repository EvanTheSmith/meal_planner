document.addEventListener('DOMContentLoaded', () => {

let theMeals = document.getElementById("meals_go_here");
let theItems = document.getElementById("items_go_here");

fetch('http://localhost:3000/meals')
.then(response => response.json())
.then(data => renderMeals(data));

function renderMeals(theMeals) {
    // This function will render the meals and their respective items into the table rows
}

})