class Actu
  include Locomotive::Mongoid::Document
  
  field :title
  field :block
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  referenced_in :site
end