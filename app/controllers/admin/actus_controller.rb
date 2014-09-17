module Admin
  class ActusController < BaseController

    sections 'contents', 'news'
    
    before_filter :remove_cache
    
    def index
      #@actus = Actu.for_season(@current_site.season_back)
      @actus = Actu.all
    end
    
    def remove_cache
      expire_action :controller => '/front/datas', :action => 'get_intro'
    end
    
  end
end