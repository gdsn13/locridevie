class Front::NewslettersController < ApplicationController
  
  def show_newsletter
    @newsletter = ContentType.where(:slug => "newsletters").first.contents.where(:_slug => params[:id]).first
    
    render :template => '/front/layouts/newsletter.html', :layout => false
  end
  
end