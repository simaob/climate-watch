module CaitIndc
  class Category < ApplicationRecord
    has_many :indicators, class_name: 'CaitIndc::Indicator'
    validates :name, presence: true
  end
end