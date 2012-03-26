module Admin
  class SeasonsController < BaseController

    sections 'settings', 'seasons'
    
    def index
      @seasons = current_site.seasons
    end
    
    
  end
end