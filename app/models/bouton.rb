class Bouton
  include Locomotive::Mongoid::Document
  
  field :title
  field :block
  field :url
  
  mount_uploader :le_bouton, BoutonUploader
  mount_uploader :son, SoundUploader
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  belongs_to :season
  referenced_in :site
  
  def self.for_season p_season_id    
    where(:season_id => p_season_id)
  end
end