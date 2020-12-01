class ItemsController < ApplicationController
    def show
        item = Item.find(params[:id])
        # render json: item;
        render json: ItemSerializer.new(item).to_serialized_json
    end

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