class Meal < ApplicationRecord
    has_many :items, -> { order 'updated_at asc' }
end