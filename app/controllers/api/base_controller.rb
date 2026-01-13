module Api
  # Base controller for all API endpoints
  # Inherits from ActionController::API (lighter than ActionController::Base)
  # This gives us JSON responses without view rendering capabilities
  class BaseController < ActionController::API
    # This will add authentication later with Devise
    # before_action :authenticate_user!

    # Handle errors and return JSON responses
    rescue_from ActiveRecord::RecordNotFound, with: :not_found
    rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

    private

    def not_found(exception)
      render json: { error: exception.message }, status: :not_found
    end

    def unprocessable_entity(exception)
      render json: { error: exception.message, details: exception.record.errors }, status: :unprocessable_entity
    end
  end
end
