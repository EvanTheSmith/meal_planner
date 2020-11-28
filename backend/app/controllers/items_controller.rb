class ItemsController < ApplicationController
    # This is not fleshed out or in use yet, but the controller is beginning its setup
    def destroy
        item = Item.find(params[:id])
        item.destroy
    end 
end