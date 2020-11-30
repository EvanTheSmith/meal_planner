Rails.application.routes.draw do
  get '/meals' => 'meals#index'  
  delete '/items/:id', to: 'items#destroy'
end
