class Front::DatasController < ApplicationController

  respond_to :json
  
  #render a specatcle list and the associated page to be rendered
  def spectacle_list   
    page = Page.where(:slug => params[:id]).first
    
    list_to_json = {
      #:spectacles => spectacles,
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
                      :jules => page.embeded_items.get_jules_for_json(page), 
                      :boutons => page.embeded_items.get_boutons_for_json, 
                      :actus => page.embeded_items.get_actus_for_json,
                      :picto => page.bck_img.url
                   }
    
    render :json => page_to_json.to_json
  end
  
  def get_intro
    intro = Page.where(:fullpath => "index").first
    
    if intro.embeded_items.exists? 
      intro_to_json = {
        :logo => intro.bck_img.url,
        :jules => intro.embeded_items.get_jules_for_json(intro), 
        :boutons => intro.embeded_items.get_boutons_for_json
      } 
    end 
        
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
    
    spectacle = { :title => sp.titre,
                  :numero => sp.numero,
                  :tld => sp.tld,
                  :slug => sp._slug,
                  :date => sp.date,
                  :presentation => sp.presentation,
                  :logo => sp.logo.url,
                  :images => images,
                  :sliders => {
                    :bio => sp.biographie,
                    :distribution => sp.distribution,
                    :la_presse => sp.la_presse,
                    :dossier_de_presse => sp.dossier_de_presse
                  }
                }
                
    render :json => spectacle
  end
  
  def newsletter
    @newsletter = ContentType.where(:slug => "newsletter").first.contents.where(:_slug => params[:id]).first
    
    render :template => '/front/layouts/newsletter.html', :layout => false
  end
end
