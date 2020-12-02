class Item < ApplicationRecord
    belongs_to :meal
    validates :name, presence: true
    validates :calories, presence: true

    def self.count_all_calories
        rubyArray = []
        Item.all.each {|i| rubyArray << i.calories }
        return {calories: rubyArray.reduce(0, :+)}
    end
end