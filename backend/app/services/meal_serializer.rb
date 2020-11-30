class MealSerializer
  def initialize(meal_object)
    @meal = meal_object
  end

  def to_serialized_json
    @meal.to_json(:include => {:items => {:only => [:id, :name, :kind, :calories]}}, 
    :except => [:updated_at, :created_at])
  end
    
end