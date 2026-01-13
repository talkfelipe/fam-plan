class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Associations
  has_many :events, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :role, presence: true, inclusion: { in: %w[admin parent child member] }
end
