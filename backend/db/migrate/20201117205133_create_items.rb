class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string :name
      t.string :kind
      t.integer :calories
      t.integer :meal_id

      t.timestamps
    end
  end
end
