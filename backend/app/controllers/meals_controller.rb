class MealsController < ApplicationController
    def index
      meals = Meal.all
      # render json: meals, include: [:items]
      render json: MealSerializer.new(meals).to_serialized_json
    end
end