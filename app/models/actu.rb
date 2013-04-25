class Actu
  include Locomotive::Mongoid::Document
  
  field :title
  field :block
  field :numero
  field :genre
  field :age
  field :dates
  field :tld
  field :url
  field :resa
  
  mount_uploader :picto, ActuUploader
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  belongs_to :season
  referenced_in :site
  
  def self.for_season p_season_id    
    where(:season_id => p_season_id)
  end
  
  def self.for_menu p_season_id
    where(:season_id => p_season_id).order_by([[:updated_at, :desc]]).limit(10)
  end
end