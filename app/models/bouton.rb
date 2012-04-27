class Bouton
  include Locomotive::Mongoid::Document
  
  field :title
  
  mount_uploader :le_bouton, BoutonUploader
  mount_uploader :son, SoundUploader
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  referenced_in :site
end