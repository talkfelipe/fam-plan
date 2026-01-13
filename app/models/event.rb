class Event < ApplicationRecord
  belongs_to :user

  # Validations
  validates :title, presence: true
  validates :start_time, presence: true
  validates :event_type, inclusion: { in: %w[appointment reminder task birthday other] }, allow_nil: true
  validate :end_time_after_start_time

  # Scopes for querying events
  scope :upcoming, -> { where('start_time >= ?', Time.current).order(:start_time) }
  scope :past, -> { where('start_time < ?', Time.current).order(start_time: :desc) }

  private

  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?

    if end_time < start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end
