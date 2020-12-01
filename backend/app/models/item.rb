class Item < ApplicationRecord
    belongs_to :meal

    def self.count_all_calories
        rubyArray = []
        Item.all.each {|i| rubyArray << i.calories }
        return rubyArray.reduce(0, :+)
    end
end