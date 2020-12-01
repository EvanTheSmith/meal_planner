Rails.application.routes.draw do
  get '/meals' => 'meals#index'
  get '/items/:id', to: 'items#show'
  delete '/items/:id', to: 'items#destroy'
  post '/items', to: 'items#create'
end
