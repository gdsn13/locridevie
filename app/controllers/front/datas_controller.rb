class Front::DatasController < ApplicationController

  respond_to :json
  #caches_action :spectacle_list, :get_page, :get_dates, :get_intro, :get_spectacle
  
  #render a specatcle list and the associated page to be rendered
  def spectacle_list   
    page = Page.where(:slug => params[:id]).first
    
    list_to_json = {
      #:spectacles => spectacles,
      :page => {
        :fullpath => page.fullpath, 
        :body => page.body,
        :jules => page.embeded_items.get_jules_for_json(page), 
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
  
  def get_dates
    dates = ContentType.where(:slug => "calendrier").first.contents
    page = Page.where(:slug => "calendrier").first
    
    dates_classified = dates.sort_by {|d| [d.date, d.heure]}
    
    calendar = dates_classified.map do |d|
      
      d.spectacle.spectacle_associe != nil ? url = d.spectacle.spectacle_associe._slug : url = d.spectacle._slug
      
      {
        :numero => d.spectacle.numero,
        :date => d.date.strftime("%Y/%m/%d"),
        :heure => d.heure,
        :lieu => d.lieu,
        :spectacle => d.spectacle.titre,
        :href => url,
        :tarif => d.tarif,
        :green => d.green,
        :red => d.red,
        :tout_public => d.tout_public,
        :temps_scolaire => d.temps_scolaire,
        :des => d.des,
        :audiodesc => d.audiodescription,
        :lds => d.langage_des_signes
      }
    end
    
    calendar_to_json = {
      :dates => calendar,
      :jules => page.embeded_items.get_jules_for_json(page)
    } 
    
    render :json => calendar_to_json
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
                  :date => sp.date.strftime("%Y/%m/%d"),
                  :presentation => sp.presentation.html_safe,
                  :logo => sp.logo.url,
                  :images => images
                }
                
    render :json => spectacle
  end
  
  def newsletters
    page = Page.where(:slug => "newsletters").first
    newsletters = ContentType.where(:slug => "newsletters").first.contents.map do |nl|
      {
        :titre  => nl.titre,
        :date   => nl.date,
        :slug   => nl._slug
      }
    end
    
    nl_json = {
      :newsletters => newsletters,
      :jules  => page.embeded_items.get_jules_for_json(page)
    }
    
    render :json => nl_json
  end
  
  def espace_pro_page
    page = Page.where(:redirect_url => "/espace_pro").first
    
    page_to_json = {  
                      :fullpath => page.fullpath,
                      :body => page.body,
                      :jules => page.embeded_items.get_jules_for_json(page)
                   }
    
    render :json => page_to_json.to_json
  end
  
  def get_pros
    user = params[:login_field]
    psswd = params[:psswd_field]
    
    if user == "presse" && psswd == "saisonlacriee"
      ddp = ContentType.where(:slug => "spectacles").first.contents.map do |s|
        {
          :titre => s.titre,
          :slug => s._slug,
          :numero => s.numero,
          :ddp => s.dossier_de_presse.url,
          :images_presse => s.images_presse.url
        }
      end
  
      res = {
        :user_name   => "presse",
        :datas  => ddp
      }
    elsif user == "technique" && psswd == "lacriee13"
      tech = ContentType.where(:slug => "fiches_techniques").first.contents.map do |ft|
        {
          :titre => ft.titre,
          :url => ft.fiche.url
        }
      end
      
      res = {
        :user_name => "technique",
        :datas => tech
      }
    else 
      res = {
        :user_name => 'unknown'
      }
    end
    
    render :json => res.to_json
  end
end
