class Front::IphonesController < ApplicationController
  #Agenda de la saison
  
  def affiche
    current_site = Site.first
        
    affiche_pt = ContentType.where(:slug => "spectacles").first.contents.where(:_slug => current_site.affiche_pt).first
    affiche_gt = ContentType.where(:slug => "spectacles").first.contents.where(:_slug => current_site.affiche_gt).first
    
    aff = []
    
    aff << {:petit => { :title => affiche_pt.titre, 
                        :auteur => "", 
                        :director => "", 
                        :dates => "",
                        :logo => affiche_pt.images.first != nil ? "http://www.theatre-lacriee.com#{affiche_pt.images.first.file.url}" : "", 
                        :sum => ""
                      }
                }
                            
    aff << {:grand => { :title => affiche_gt.titre, 
                        :auteur => "", 
                        :director => "", 
                        :dates => "",
                        :logo => affiche_gt.images.first != nil ? "http://www.theatre-lacriee.com#{affiche_gt.images.first.file.url}" : "",
                        :sum => ""
                      }
                }
                
    render :json => aff
  end
  
  def agenda
    #date = Date.strptime(string, "%d/%m/%Y")
    dates = ContentType.where(:slug => "calendrier").first.contents.map do |d|
      {
        :id => d.spectacle._id,
        :timing => "#{d.date}T00:00:00+02:00",
        :title => d.titre.html_safe,
        :logo => d.spectacle.images.first != nil ? d.spectacle.images.first.file.url : "",
        :dates => "",
        :autheur => "",
        :director => ""
      }
    end
    
    render :json => dates
  end
  
  #Liste des spectacles
  def spectacles
    spectacles = ContentType.where(:slug => "spectacles").first.contents.map do |s|
      
      if s.season_id == current_site.season_front
        {
          :id => s._id,
          :title => s.titre.html_safe,
          :logo => s.images.first.file.url,
          :date => "",
          :autheur => "",
          :director => ""
        }
      end
    end
    
    render :json => spectacles
  end
  
  def spectacle
    spectacle = ContentType.where(:slug => "spectacles").first.contents.where(:id => params[:id]).first
    
    images = []
    spectacles.images.each do |i|  
      images << i.file.url
    end
    
    {
      :information => "",
      :contenu => "",
      :description => spectacle.presentation,
      :images => images
    }
    
  end
  
  
  
end