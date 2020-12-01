class ItemsController < ApplicationController

    def create
        meal = Meal.find_by(name: params[:meal]);
        item = Item.create(name: params[:name], calories: params[:calories], kind: params[:kind], meal: meal);
        render json: item;
    end 

    def destroy
        item = Item.find(params[:id])
        item.destroy
    end 

end