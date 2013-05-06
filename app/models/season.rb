class Season
  include Locomotive::Mongoid::Document
  
  field :name
  field :numero
  
  validates_presence_of :site, :name
  
  has_many :jules
  has_many :boutons
  has_many :actus
  referenced_in :site
end