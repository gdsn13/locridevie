class Front::IphonesController < ApplicationController
  #Agenda de la saison
  
  def affiche
    affiche = ContentType.where(:slug => "spectacles").first.contents.limit(2)
    
    aff = []
    
    aff << {:petit => {:title => ActionController::Base.helpers.strip_tags(affiche[0].titre.html_safe), 
                            :auteur => "", 
                            :director => "", 
                            :dates => "",
                            :logo => "http://www.theatre-lacriee.com#{affiche[0].images.first.file.url}", 
                            :sum => ""
                            }
                }
                            
    aff << {:grand => {:title => ActionController::Base.helpers.strip_tags(affiche[1].titre), 
                            :auteur => "", 
                            :director => "", 
                            :dates => "",
                            :logo => "http://www.theatre-lacriee.com#{affiche[1].images.first.file.url}",
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