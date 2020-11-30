Rails.application.routes.draw do
  get '/meals' => 'meals#index'  
  delete '/items/:id', to: 'items#destroy'
  post '/items', to: 'items#create'
end
