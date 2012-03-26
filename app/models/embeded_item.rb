class EmbededItem

  include Locomotive::Mongoid::Document
  
  ## fields ##
  field :situation, :default => 'top' 
  field :position
  field :type
  field :item_id
  
  ## associations ##
  #referenced_in :jule, :validate => false
  embedded_in :page, :inverse_of => :embeded_items
  
  ## named scopes ##
  scope :top, :where => { :situation => 'top' }
  scope :bottom, :where => { :situation => 'bottom' }
  
  scope :jules, :where => { :type => 'jules'}, :order_by => [[:position, :asc]]
  scope :actus, :where => { :type => 'actus'}, :order_by => [[:position, :asc]]
  scope :boutons, :where => { :type => 'boutons'}, :order_by => [[:position, :asc]]
end