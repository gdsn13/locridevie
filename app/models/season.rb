class Season
  include Locomotive::Mongoid::Document
  
  field :name
  
  validates_presence_of :site, :name
  
  has_many :jules
  has_many :boutons
  has_many :actus
  referenced_in :site
end