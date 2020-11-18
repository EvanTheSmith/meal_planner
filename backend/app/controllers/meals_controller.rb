class MealsController < ApplicationController
    def index
      meals = Meal.all
      render json: MealSerializer.new(meals).to_serialized_json
    end
end