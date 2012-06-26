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
      ct = ContentType.where(:slug => params[:id]).first
      items = ct.contents
        
      csv_string = CSV.generate({}) do |csv|
        #csv = []
        #liste des champs
        list_of_field = [];
        ct.content_custom_fields.each do |field|
           list_of_field << field.label
        end
        csv << list_of_field
        
        #Valeurs des champs
        #csv << list_of_field
        items.each do |item|
            content_of_line = []
            ct.content_custom_fields.each do |specific_field|
              content_of_line << item.send(specific_field._alias)
            end
            csv << content_of_line
        end
      end

      csv_string = csv.to_s.to_csv
      # send csv file(users.csv) to browser
      send_data(csv_string, :type => 'text/csv; charset=utf-8; header=present', :filename => "users.csv")
    end

    protected

    def authorize_export
      authorize! :export, Site
    end

  end
end