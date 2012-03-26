class Season
  include Locomotive::Mongoid::Document
  
  field :name
  
  validates_presence_of :site, :name
  
  referenced_in :site
  #references_many :contents, :class_name => 'ContentInstance'
  #embedded_in :site, :inverse_of => :memberships
end