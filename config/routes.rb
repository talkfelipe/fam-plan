Rails.application.routes.draw do
  root to: "pages#home"

  # API routes (for React frontend)
  namespace :api do
    # Devise routes for authentication with custom controllers
    devise_for :users,
               path: '',
               path_names: {
                 sign_in: 'login',
                 sign_out: 'logout',
                 registration: 'signup'
               },
               controllers: {
                 sessions: 'api/sessions',
                 registrations: 'api/registrations'
               }

    # Calendar events endpoints
    resources :events, only: [:index, :show, :create, :update, :destroy]
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
