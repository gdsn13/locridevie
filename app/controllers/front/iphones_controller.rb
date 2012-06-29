class Front::IphonesController < ApplicationController
  #Agenda de la saison
  def agenda
    #date = Date.strptime(string, "%d/%m/%Y")
    dates = ContentType.where(:slug => "calendrier").first.contents.map do |d|
      {
        :id => d.spectacle._id,
        :timing => "#{d.date}T00:00:00+02:00",
        :title => d.titre,
        :logo => d.spectacle.images.first != nil ? d.spectacle.images.first.file.url : "",
        :dates => d.spectacle.tld,
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
          :title => s.titre,
          :logo => s.images.first.file.url,
          :date => s.tld,
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