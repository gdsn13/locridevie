module Admin
  class ContentsController < BaseController

    sections 'objects'

    before_filter :set_content_type

    respond_to :json, :only => [:create, :update, :sort]

    skip_load_and_authorize_resource

    before_filter :authorize_content

    helper_method :breadcrumb_root, :breadcrumb_url, :back_url

    def index
      @contents = @content_type.list_or_group_contents
    end

    def new
      new! { @content.attributes = params[:content] }
    end

    def create
      # Hack to provide the default field in case of an File collection upload through Flash uploader ...
      if params[:auth_token]
        @content = build_resource
        (@content_type.content_custom_fields.delete_if{ |e| !e.required }.map{ |e| e.label }+['_slug']).each do |field|
          @content.send((field+'=').to_sym, params[:Filename].downcase) unless !@content.send(field.to_sym).nil? || params[:Filename].nil?
        end
        sllug = 0
        while !@content.valid? && sllug < 100 do
          @content._slug = params[:Filename].downcase+'_'+sllug.to_s
          sllug += 1
        end
      end
      
      case @content_type.slug
        when "calendrier"
          expire_action :controller => '/front/datas', :action => 'get_dates'
        when "spectacles"
          expire_action :controller => '/front/datas', :action => 'spectacle_list'
      end
      
      create! { after_create_or_update_url }      
    end

    def edit
      edit! { @content.attributes = params[:content] }
    end

    def update
      update! { after_create_or_update_url }

      p '44444444'
      p '44444444'
      p '44444444'
      p '44444444'
      p @content
      
      case @content_type.slug
        when "calendrier"
          expire_action :controller => '/front/datas', :action => 'get_dates'
        when "spectacles"
          expire_action :controller => '/front/datas', :action => 'spectacle_list'
          expire_action :controller => '/front/datas', :action => 'get_spectacle', :id => @content._slug
      end
    end

    def sort
      @content_type.sort_contents!(params[:children])

      respond_with(@content_type, :location => admin_contents_url(@content_type.slug))
    end

    def destroy
      destroy! { admin_contents_url(@content_type.slug) }
    end

    protected

    def set_content_type
      @content_type ||= current_site.content_types.where(:slug => params[:slug]).first
      #$ct = @content_type
    end

    def begin_of_association_chain
      set_content_type
    end

    def after_create_or_update_url
      if params[:breadcrumb_alias].blank?
        edit_admin_content_url(@content_type.slug, @content.id)
      else
        self.breadcrumb_url
      end
    end

    def authorize_content
      authorize! params[:action].to_sym, ContentInstance
    end

    def breadcrumb_root
      return nil if params[:breadcrumb_alias].blank?

      @breadcrumb_root ||= resource.send(params[:breadcrumb_alias].to_sym)
    end

    def breadcrumb_url
      edit_admin_content_url(self.breadcrumb_root._parent.slug, self.breadcrumb_root)
    end

    def back_url
      self.breadcrumb_root ? self.breadcrumb_url : admin_contents_url(@content_type.slug)
    end

  end
end
