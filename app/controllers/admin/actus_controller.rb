module Admin
  class ActusController < BaseController

    sections 'contents', 'news'
    
    def index
      @actus = Actu.for_season(@current_site.season_back)
    end    
  end
end