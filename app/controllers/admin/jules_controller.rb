module Admin
  class JulesController < BaseController

    sections 'contents', 'jules'
    
    def index
      @jules = Jule.for_season(@current_site.season_back)
    end
    
  end
end