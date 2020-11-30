# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

brek = Meal.first;
lunch = Meal.second;
supper = Meal.third;

Item.create(name: "Banana", kind: "food", calories: 105, meal: brek);
Item.create(name: "Orange Juice", kind: "food", calories: 143, meal: brek);
Item.create(name: "Buttered Toast", kind: "food", calories: 102, meal: brek);

Item.create(name: "Big Mac", kind: "food", calories: 563, meal: lunch);