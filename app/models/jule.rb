class Jule
  include Locomotive::Mongoid::Document
  
  field :name
  field :block
  field :url
  
  mount_uploader :picto, JuleUploader
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  referenced_in :site
end