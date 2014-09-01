module Admin
  class BoutonsController < BaseController

    sections 'contents', 'buttons'
    
    def index
      #@boutons = Bouton.for_season(@current_site.season_back)
      @boutons = Bouton.for_season(@current_site.season_back)
    end
    
  end
end