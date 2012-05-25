module Extensions
  module Page
    module EmbededItems
  
      extend ActiveSupport::Concern
  
      included do
        embeds_many :embeded_items
      
        accepts_nested_attributes_for :embeded_items, :allow_destroy => true
        #attr_accessible :embeded_items_attributes
      end
      
      module InstanceMethods
        
        def clean_embededs(items)
          self.embeded_items = []
          
          items.keys.each do |emb|
            self.embeded_items.create(items[emb])
          end if items != nil    
        end
        
      end
      
    end
  end
end