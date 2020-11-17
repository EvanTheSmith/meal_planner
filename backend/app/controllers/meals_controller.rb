class MealsController < ApplicationController
    def index
      meals = Meal.all
      render json: meals, include: [:items]
    end
end