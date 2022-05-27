brek = Meal.create(name: "Breakfast");
lunch = Meal.create(name: "Lunch");
dinner = Meal.create(name: "Dinner");

Item.create(name: "Banana", kind: "food", calories: 105, meal: brek);
Item.create(name: "Orange Juice", kind: "food", calories: 143, meal: brek);
Item.create(name: "Buttered Toast", kind: "food", calories: 102, meal: brek);

Item.create(name: "Big Mac", kind: "food", calories: 563, meal: lunch);