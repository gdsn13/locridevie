module Admin::PagesHelper

  def parent_pages_options
    roots = current_site.pages.roots.where(:slug.ne => '404').and(:_id.ne => @page.id)

    [].tap do |list|
      roots.each do |page|
        list = add_children_to_options(page, list)
      end
    end
  end

  def add_children_to_options(page, list)
    return list if page.path.include?(@page.id) || page == @page

    offset = '- ' * (page.depth || 0) * 2

    list << ["#{offset}#{page.title}", page.id]
    page.children.each { |child| add_children_to_options(child, list) }
    list
  end

  def options_for_page_cache_strategy
    [
      [t('.cache_strategy.none'), 'none'],
      [t('.cache_strategy.simple'), 'simple'],
      [t('.cache_strategy.hour'), 1.hour.to_s],
      [t('.cache_strategy.day'), 1.day.to_s],
      [t('.cache_strategy.week'), 1.week.to_s],
      [t('.cache_strategy.month'), 1.month.to_s]
    ]
  end

  def options_for_page_rendering
    [
     ['layout', 'layout'],
     ['liquid page', 'liquid_page'],
     ['liquid body', 'liquid_body'],
    ]
  end

    
  def embeded_items_data_to_js (type )
    collection = []
    
    case type
      when 'jules'
        collection = Jule.all.map{ |jul| [jul.name, jul._id]}
        options = {
          # NE PAS CHANGER L'ORDRE DES TAKEN_IDS VALUES. JULE ID DOIT ETRE EN 2 ET ID EN 1
          :taken_ids => @page.embeded_items.jules.empty? ? [] : @page.embeded_items.jules.map{ |item| [item.id, item.item_id, item.position] }
        }
      when 'actus'
        collection = Actu.all.map{ |act| [act.title, act._id]}
        options = {
          # NE PAS CHANGER L'ORDRE DES TAKEN_IDS VALUES. JULE ID DOIT ETRE EN 2 ET ID EN 1
          :taken_ids => @page.embeded_items.actus.empty? ? [] : @page.embeded_items.actus.map{ |item| [item.id, item.item_id, item.position] }
        }
      when 'boutons'
        collection = Bouton.all.map{ |btn| [btn.title, btn._id]}
        options = {
          # NE PAS CHANGER L'ORDRE DES TAKEN_IDS VALUES. JULE ID DOIT ETRE EN 2 ET ID EN 1
          :taken_ids => @page.embeded_items.boutons.empty? ? [] : @page.embeded_items.boutons.map{ |item| [item.id, item.item_id, item.position] }
        }
    end 
    
    collection_to_js(collection, options)
  end
  
end
