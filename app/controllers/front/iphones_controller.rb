class Front::IphonesController < ApplicationController
  #Agenda de la saison
  
  #caches_action :affiche, :agenda
  
  include ActionView::Helpers::SanitizeHelper
  
  def affiche
    current_site = Site.first
        
    affiche_pt = ContentType.where(:slug => "spectacles").first.contents.where(:_slug => current_site.affiche_pt).first
    affiche_gt = ContentType.where(:slug => "spectacles").first.contents.where(:_slug => current_site.affiche_gt).first
    
    aff = []
    
    aff << {:petit => { :title => affiche_pt.titre, 
                        :auteur => " ", 
                        :director => " ", 
                        :dates => affiche_pt.numero + "<br/>" + affiche_pt.tld,
                        :logo => affiche_pt.images.first != nil ? "http://www.theatre-lacriee.com#{affiche_pt.images.first.file.vignette.url}" : "", 
                        :sum => affiche_pt.presentation
                      }
                }
                            
    aff << {:grand => { :title => affiche_gt.titre, 
                        :auteur => affiche_gt.numero, 
                        :director => " ", 
                        :dates => affiche_gt.tld,
                        :logo => affiche_gt.images.first != nil ? "http://www.theatre-lacriee.com#{affiche_gt.images.first.file.vignette.url}" : "",
                        :sum => affiche_gt.presentation
                      }
                }
                
    render :json => aff
  end
  
  def agenda
    dates_of_season = []
    cs = Site.first
    current_front_season = Season.find(cs.season_front)
    before_numero = current_front_season.numero.to_i - 1
    
    before_season = Season.where(:numero => before_numero.to_s).first
    
    ContentType.where(:slug => "calendrier").first.contents.each do |ad|
      
      if ad.season_id == before_season._id.to_s && ad.date.future?
        dates_of_season << ad
      end
      
      if ad.season_id == cs.season_front
        dates_of_season << ad
      end
      
    end
    
    dates_classified = dates_of_season.sort_by {|d| [d.date, d.heure]}
    
    date_for_json = dates_classified.map do |d|
      show = d.spectacle
      
      if show != nil
        show.spectacle_associe != nil ? url = show.spectacle_associe._slug : url = show._slug
        {
          :id => url,
          :timing => "#{d.date}T00:00:00+02:00",
          :title => show.numero + " " + show.titre_back_office,
          :logo => show.images.first != nil ? show.images.first.file.iphone.url : "",
          :dates => " ",
          :auteur => strip_tags(show.info_prog),
          :director => " "
        }
      end
    end
    
    render :json => date_for_json
  end
  
  #Liste des spectacles
  def spectacles
    current_site = Site.first
    current_front_season = Season.find(current_site.season_front)
    before_numero = current_front_season.numero.to_i - 1
    
    before_season = Season.where(:numero => before_numero.to_s).first
    
    s_list = []
    
    ContentType.where(:slug => "spectacles").first.contents.asc(:custom_field_7).each do |s|
      
      if s.season_id == before_season._id.to_s && s.date.future? && s.spectacle_associe == nil
        s_list << s
      end
      
      if s.season_id == current_site.season_front.to_s && s.spectacle_associe == nil
        s_list << s
      end
    end
    
    spectacles = s_list.map do |s|
      {
        :id => s._slug,
        :title => s.numero + " " + s.titre_back_office,
        :logo => s.images.first != nil ? "http://www.theatre-lacriee.com#{s.images.first.file.vignette.url}" : "",
        :dates => s.date,
        :auteur => strip_tags(s.info_prog),
        :director => " "
      }
    end
    
    render :json => spectacles
  end
  
  def spectacle
    spectacle = ContentType.where(:slug => "spectacles").first.contents.where(:_slug => params[:id]).first
    
    images = []
    spectacle.images.each do |i|  
      images << "http://www.theatre-lacriee.com#{spectacle.images.first.file.iphone.url}"
    end
    
    
    
    info = [
      {:information => spectacle.presentation}, 
      {:contenu => " "}, 
      {:description => spectacle.tld}, 
      {:images => images},
      {:files => []}
    ]
    
    render :json => info
    
  end
  
end