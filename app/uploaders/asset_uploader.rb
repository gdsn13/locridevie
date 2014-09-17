# encoding: utf-8

class AssetUploader < CarrierWave::Uploader::Base

  include Locomotive::CarrierWave::Uploader::Asset

  def store_dir
    #self.build_store_dir('contents', 'assets', model.type_parent)
    
    time = Time.new
    date_of_the_day = "#{time.day}_#{time.month}_#{time.year}" 
    
    self.build_store_dir('sites', 'assets', date_of_the_day)
  end

end
