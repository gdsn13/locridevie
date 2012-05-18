class EmbededItem

  include Locomotive::Mongoid::Document
  
  ## fields ##
  field :position
  field :type
  field :item_id
  
  ## associations ##
  #referenced_in :jule, :validate => false
  embedded_in :page, :inverse_of => :embeded_items
  
  scope :jules, :where => { :type => 'jules'}, :order_by => [[:position, :asc]]
  scope :actus, :where => { :type => 'actus'}, :order_by => [[:position, :asc]]
  scope :boutons, :where => { :type => 'boutons'}, :order_by => [[:position, :asc]]
  
  def self.get_jules( p_page )
    res = []
    
    jul = p_page.embeded_items.jules
    cur_p = p_page
    
    
    #récupére les jules, et s'il n'y en a pas, remonte au parent, remonte au parent....
    while jul.size == 0
      p '33333333'
      cur_p = cur_p.parent
      if cur_p.parent != nil
        p '44444444444444'
        jul = cur_p.parent.embeded_items.jules
      else
        p '55555555555555'
        break
      end
    end
    
    jul.each { |j| res << Jule.find(j.item_id) }
    
    res
  end
  
  
  
  def self.get_actus
    res = []
    actus.each { |j| res << Actu.find(j.item_id) }
    res
  end
  
  def self.get_boutons
    res = []
    boutons.each { |j| res << Bouton.find(j.item_id) }
    res
  end
  
  def self.get_jules_for_json( p_page )
    json = get_jules(p_page).map do |j|
      { :name => j.name, :block => j.block, :picto => j.picto.url, :url => j.url }
    end
  end
  
  def self.get_boutons_for_json
    btn = get_boutons.map do |b| 
      { :title => b.title, :son => b.son.url, :img => b.le_bouton.url, :url => b.url, :block => b.block }
    end
  end
  
  def self.get_actus_for_json
    act = get_actus.map do |a| 
      { :name => a.title, :block => a.block, :picto => a.picto.url }
    end
    
  end
end