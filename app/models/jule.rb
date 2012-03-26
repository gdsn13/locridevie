class Jule
  include Locomotive::Mongoid::Document
  
  field :name
  field :block
  
  scope :latest_updated, :order_by => [[:updated_at, :desc]]
  
  referenced_in :site
  
  ## callbacks ##
  #before_destroy :remove_memberships!
  
  def sites

  end
end