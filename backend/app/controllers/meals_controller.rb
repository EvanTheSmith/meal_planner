class MealsController < ApplicationController
    def index
      meals = Meal.all
      render json: meals, except: [:created_at, :updated_at]
    end
end