class Front::DatasController < ApplicationController

  respond_to :json
  #caches_action :spectacle_list, :get_page, :get_dates, :get_intro, :get_spectacle
  caches_page :spectacle_list, :get_page, :get_dates, :get_intro, :get_spectacle, :newsletters
  
  def spectacle_list
    spectacles = []
    
    season = Season.where(:name => params[:id]).first
    
    ContentType.where(:slug => "spectacles").first.contents.each do |s|
      if s.season_id == season._id.to_s && s.spectacle_associe == nil
        spectacles << s
      end
    end

    spectacles.sort_by! { |a| a.numero }
    
    spectacles_to_json = spectacles.map do |s|
      {
       id: s._id,
       slug: s._slug,
       info_prog: s.info_prog == nil ? "" : s.info_prog.html_safe,
       resume: s.resume,
       titre: s.titre.html_safe,
 		   date: s.date.strftime("%Y/%m/%d"),
 		   saison: s.season_id,
 			 numero: s.numero,
 			 infobulle: s.infobulle == nil ? "" : s.infobulle.html_safe,
 			 logo_large: s.images.first != nil ? s.images.first.file.url : "",
 			 date_infobulles: s.date_infobulle,
 			 lieu: s.lieu,
 			 genre: s.genre,
 			 age: s.age,
 			 tld: s.tld == nil ? "" : s.tld.html_safe
      }
    end
    
    list_to_json = {
      :slug => params[:id],
      :spectacles => spectacles_to_json
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
    dates_of_season = []
    cs = Site.first
    current_front_season = Season.find(cs.season_front)
    before_numero = current_front_season.numero.to_i - 1
    
    before_season = Season.where(:numero => before_numero.to_s).first
    
    dates = ContentType.where(:slug => "calendrier").first.contents.each do |ad|
      
      if ad.season_id == before_season._id.to_s && ad.date.future?
        dates_of_season << ad
      end
      
      if ad.season_id == cs.season_front
        dates_of_season << ad
      end
      
    end
    
    dates_classified = dates_of_season.sort_by {|d| [d.date, d.heure]}
    
    calendar = dates_classified.map do |d|
      
      if d.spectacle != nil
      
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
          :lds => d.langage_des_signes,
          :associe => d.spectacle.spectacle_associe != nil ? "true" : "false",
          :plage_age => d.plage_age
        }
      end
    end
    
    calendar_to_json = {
      :dates => calendar,
    } 
    
    render :json => calendar_to_json
  end
  
  def get_intro
    intro = Page.where(:fullpath => "index").first
    
    if intro.embeded_items.exists? 
      intro_to_json = {
        :actus => intro.embeded_items.get_actus_for_json
      } 
    end 
        
    render :json => intro_to_json.to_json
  end
  
  def search
    page = Page.where(:slug => "rechercher").first
    query = params[:query_string]
    
    if query != "" and query != nil
      query.downcase!
      spectacles_result = []
    
      #récupération du type de contenu et des contenus
      sct = ContentType.where(:slug => "spectacles").first
      spectacles = sct.contents
    
      #creation du pattern de recherche avec les custom fields n
      search_pattern = sct.content_custom_fields.map do |fld|
        {"#{fld._name}" => /#{query}/i} 
      end
    
      #on lance la requette sur les spectacles
      spectacles.where('$or' => search_pattern).each do |s|
        spectacles_result << {
          :titre => s.titre,
          :numero => s.numero,
          :slug => s._slug,
          :spectacle_associe_path => s.spectacle_associe != nil ? s.spectacle_associe._slug : "",
        }  
      end
    
      #on cherche dans les pages
      pages = Page.where('$or' => [{:titre => /#{query}/i}, {:body => /#{query}/i}]).map do |pgs|
        {
          :titre => pgs.title,
          :fullpath => pgs.fullpath
        }
      end
    
      search_result = {
        :query => query,
        :jules => page.embeded_items.get_jules_for_json(page),
        :spectacles => spectacles_result,
        :pages => pages
      }
    else
      search_result = {
        :query => query,
        :jules => page.embeded_items.get_jules_for_json(page),
        :spectacles => [],
        :pages => []
      }
    end  
    
    render :json => search_result.to_json
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
                  :genre => sp.genre,
                  :age => sp.age,
                  :slug => sp._slug,
                  :date => sp.date.strftime("%Y/%m/%d"),
                  :presentation => sp.presentation.html_safe,
                  :logo => sp.logo.url,
                  :resa => sp.adresse_reservation,
                  :autour => sp.autour == nil ? "" : sp.autour.html_safe,
                  :plus => sp.en_savoir_plus == nil ? "" : sp.en_savoir_plus.html_safe,
                  :video => sp.youtube,
                  :date_affichee => sp.date_infobulle,
                  :images => images,
                  :resume => sp.resume,
                  :info_prog => sp.info_prog == nil ? "" : sp.info_prog.html_safe
                }
                
    render :json => spectacle
  end
  
  def newsletters
    page = Page.where(:redirect_url => "/newsletters").first
    newsletters = ContentType.where(:slug => "newsletters").first.contents.map do |nl|
      {
        :titre  => nl.titre,
        :date   => nl.date,
        :slug   => nl._slug,
        :publie => nl.publie
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
        :datas  => ddp.sort_by{|e| e[:numero]}
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
