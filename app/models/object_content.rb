class ObjectContent
  
  include Locomotive::Mongoid::Document
  
  referenced_in :site

end