module Api
  # Handles user login/logout via API with JWT tokens
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token

    private

    # Override Devise method to return JSON response on successful login
    def respond_with(resource, _opts = {})
      render json: {
        message: 'Logged in successfully.',
        user: {
          id: resource.id,
          email: resource.email,
          name: resource.name,
          role: resource.role
        }
      }, status: :ok
    end

    # Override Devise method to return JSON response on logout
    def respond_to_on_destroy
      if request.headers['Authorization'].present?
        render json: {
          message: 'Logged out successfully.'
        }, status: :ok
      else
        render json: {
          message: 'No active session.'
        }, status: :unauthorized
      end
    end
  end
end
