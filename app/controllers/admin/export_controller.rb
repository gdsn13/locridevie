module Admin
  class ExportController < BaseController

    require "csv"

    skip_load_and_authorize_resource

    before_filter :authorize_export

    def new
      zipfile = ::Locomotive::Export.run!(current_site, current_site.name.parameterize)
      send_file zipfile, :type => 'application/zip', :disposition => 'attachment'
    end
    
    def export_datas
      #http://www.ruby-doc.org/stdlib-1.9.3/libdoc/csv/rdoc/CSV.html#method-c-generate
      #http://stackoverflow.com/questions/6933283/ruby-1-9-2-export-a-csv-string-without-generating-a-file
      ct = ContentType.where(:slug => params[:id]).first
      items = ct.contents
      
      csv_string = CSV.generate do |csv|
        list_of_field = [];
        ct.content_custom_fields.each do |field|
           list_of_field << field.label
        end
        csv << list_of_field
        
        #Valeurs des champs
        items.each do |item|
            content_of_line = []
            ct.content_custom_fields.each do |specific_field|
              content_of_line << item.send(specific_field._alias)
            end
            csv << content_of_line
        end
      end

      send_data csv_string, :type=>'text/csv;charset=utf-8;', :filename=>'contacts_export.csv', :disposition =>'attachment', :encoding => 'utf8'
    end

    protected

    def authorize_export
      authorize! :export, Site
    end

  end
end