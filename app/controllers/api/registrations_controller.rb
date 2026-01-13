module Api
  # Handles user registration (signup) via API
  class RegistrationsController < Devise::RegistrationsController
    respond_to :json
    skip_before_action :verify_authenticity_token
    before_action :configure_sign_up_params, only: [:create]

    private

    # Permit additional parameters for signup
    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :role])
    end

    # Override to get params from the correct location
    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name, :role)
    end

    # Override Devise method to return JSON response on successful signup
    def respond_with(resource, _opts = {})
      if resource.persisted?
        render json: {
          message: 'Signed up successfully.',
          user: {
            id: resource.id,
            email: resource.email,
            name: resource.name,
            role: resource.role
          }
        }, status: :ok
      else
        Rails.logger.error "User creation failed: #{resource.errors.full_messages.join(', ')}"
        render json: {
          message: 'User could not be created.',
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    end
  end
end
