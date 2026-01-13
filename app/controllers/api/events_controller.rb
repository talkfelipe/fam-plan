module Api
  # API controller for managing calendar events
  class EventsController < Api::BaseController
    before_action :authenticate_api_user!
    before_action :set_event, only: [:show, :update, :destroy]

    # GET /api/events
    # Returns all events for the current user
    def index
      @events = current_api_user.events.order(start_time: :asc)
      render json: @events
    end

    # GET /api/events/:id
    # Returns a specific event
    def show
      render json: @event
    end

    # POST /api/events
    # Creates a new event
    def create
      @event = current_api_user.events.build(event_params)

      if @event.save
        render json: @event, status: :created
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/events/:id
    # Updates an existing event
    def update
      if @event.update(event_params)
        render json: @event
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/events/:id
    # Deletes an event
    def destroy
      @event.destroy
      head :no_content
    end

    private

    def set_event
      @event = current_api_user.events.find(params[:id])
    end

    def event_params
      params.require(:event).permit(
        :title,
        :description,
        :start_time,
        :end_time,
        :all_day,
        :event_type
      )
    end
  end
end
