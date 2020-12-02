Rails.application.routes.draw do
  get '/meals' => 'meals#index'
  get '/items/calories', to: 'items#calories'
  get '/items/:id', to: 'items#show'

  patch '/items/:id', to: 'items#patch'
  delete '/items/:id', to: 'items#destroy'
  post '/items', to: 'items#create'
end
