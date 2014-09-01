module Admin
  class JulesController < BaseController

    sections 'contents', 'jules'
    
    def index
      @jules = Jule.all
    end
    
  end
end