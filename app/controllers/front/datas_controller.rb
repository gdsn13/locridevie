class Front::DatasController < ApplicationController

  respond_to :json
  
  #render a specatcle list and the associated page to be rendered
  def spectacle_list   
    page = Page.where(:slug => params[:id]).first
    site = Site.first
    spectacles = []
            
    ContentType.where(:slug => "spectacles").first.contents.each do |s|
      if s.season_id == site.season_front
        spectacles << s
      end
    end
    
    #ContentType.where(:slug => "spectacles").first.contents.where(:season_id => site.season_front.to_i)
    
    spectacles = spectacles.map do |spec| 
        { :id => spec.id,
  			  :slug => spec._slug,
  			  :titre => spec.titre,
  			  :date => spec.date,
  			  :en_tournee => spec.en_tournee,
  			  :saison => spec.season_id,
  			  :logo => spec.logo.url
  		  }
    end
    
    list_to_json = {
      :spectacles => spectacles,
      :page => {
        :fullpath => page.fullpath, 
        :body => page.body,
        :jules => page.embeded_items.get_jules_for_json, 
        :boutons => page.embeded_items.get_boutons_for_json, 
        :actus => page.embeded_items.get_actus_for_json
      }
    }
    
    render :json => list_to_json.to_json
    
  end
  
  # render a page to be displayed in the front office
  def get_page
    page = Page.where(:fullpath => params[:fullpath]).first
    
    page_to_json = {  :fullpath => page.fullpath, 
                      :body => page.body, 
                      :jules => page.embeded_items.get_jules_for_json, 
                      :boutons => page.embeded_items.get_boutons_for_json, 
                      :actus => page.embeded_items.get_actus_for_json
                   }
    
    render :json => page_to_json.to_json
  end
  
  def get_intro
    intro = Page.where(:fullpath => "index").first
    
    intro_to_json = {
      :jules => intro.embeded_items.get_jules_for_json, 
      :boutons => intro.embeded_items.get_boutons_for_json
    }
    
    render :json => intro_to_json.to_json
  end
  
  def get_spectacle
    site = Site.first
    
    sp = ContentType.where(:slug => "spectacles").first.contents.where(:_slug => params[:slug]).first
    
    images = sp.images.map do |img|
      { 
        :image => img.file.url, 
        :thumb => img.file.thumb.url
      }
    end
    
    videos = sp.videos.map do |vid|
      { 
        :url => vid.file.url 
      }
    end
    
    spectacle = { :title => sp.titre,
                  :slug => sp._slug,
                  :auteur => sp.auteur,
                  :date => sp.date,
                  :duree => sp.duree,
                  :presentation => sp.presentation,
                  :logo => sp.logo.url,
                  :images => images,
                  :videos => videos,
                  :sliders => {
                    :bio => sp.biographie,
                    :distribution => sp.distribution,
                    :la_presse => sp.la_presse,
                    :dossier_de_presse => sp.dossier_de_presse
                  }
                }
                
    render :json => spectacle
  end
end
