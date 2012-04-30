class Jule
  include Locomotive::Mongoid::Document
  
  field :name
  field :block
  field :url
  
  mount_uploader :picto, JuleUploader
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  belongs_to :season
  referenced_in :site
  
  
  def self.for_season p_season_id    
    where(:season_id => p_season_id)
  end
end