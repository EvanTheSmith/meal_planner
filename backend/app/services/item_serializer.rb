class ItemSerializer
  def initialize(item_object)
    @item = item_object
  end

  def to_serialized_json
    @item.to_json(:include => {:meal => {:only => :name}}, 
    :except => [:updated_at, :created_at, :meal_id])
  end
    
end