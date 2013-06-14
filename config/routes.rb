# Locomotive::Application.routes.draw do |map|

Rails.application.routes.draw do
  # admin authentication
  devise_for :admin, :class_name => 'Account', :controllers => { :sessions => 'admin/sessions', :passwords => 'admin/passwords' }

  as :admin do
    get '/admin' => 'admin/sessions#new'
  end

  # admin interface for each website
  namespace 'admin' do
    root :to => 'sessions#new'

    resources :pages do
      put :sort, :on => :member
      get :get_path, :on => :collection
    end

    resources :snippets

    resources :sites

    resource :current_site, :controller => 'current_site'

    resources :accounts

    resource :my_account, :controller => 'my_account'

    resources :memberships
    
    resources :embeded_items

    resources :theme_assets do
      get :all, :action => 'index', :on => :collection, :defaults => { :all => true }
    end

    resources :assets
    
    resources :seasons
    
    resources :object_contents
    
    resources :jules
    
    resources :actus
    
    resources :boutons

    resources :content_types

    resources :contents, :path => 'content_types/:slug/contents' do
      put :sort, :on => :collection
    end

    resources :api_contents, :path => 'api/:slug/contents', :controller => 'api_contents', :only => [:create]

    resources :custom_fields, :path => 'custom/:parent/:slug/fields'

    resources :cross_domain_sessions, :only => [:new, :create]

    resource :import, :only => [:new, :show, :create], :controller => 'import'

    resource :export, :only => [:new], :controller => 'export'

    # installation guide
    match '/installation' => 'installation#show', :defaults => { :step => 1 }, :as => :installation
    match '/installation/:step' => 'installation#show', :as => :installation_step
    match '/export/:id' => 'export#export_datas'
  end
  
  match '/newsletters'              => "front/datas#newsletters"
  match '/newsletter/:id'           => "front/newsletters#show_newsletter"
  match '/spectacles/:id'           => "front/datas#spectacles"
  match '/spectacle/:slug'          => "front/datas#spectacle"
  match '/pages/*fullpath'          => "front/datas#get_page"
  match '/intro'                    => "front/datas#get_intro"
  match '/calendrier'               => "front/datas#get_dates"
  match '/espace_pro_datas'         => "front/datas#get_pros"
  match '/espace_pro_page'          => "front/datas#espace_pro_page"
  match '/search'                   => "front/datas#search"
  #iphone!
  match 'iphone/agenda'             => "front/iphones#agenda"
  match 'iphone/spectacles'         => "front/iphones#spectacles"
  match 'iphone/spectacle'          => "front/iphones#spectacle"
  match 'iphone/affiche'            => "front/iphones#affiche"
  

  # sitemap
  match '/sitemap.xml' => 'admin/sitemaps#show', :format => 'xml'

  # robots.txt
  match '/robots.txt' => 'admin/robots#show', :format => 'txt'

  # magic urls
  match '/' => 'admin/rendering#show'
  match '*path/edit' => 'admin/rendering#edit'
  match '*path' => 'admin/rendering#show'
end
