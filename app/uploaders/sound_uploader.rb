class SoundUploader < CarrierWave::Uploader::Base

  def store_dir
    self.build_store_dir('contents', 'boutons', model.id)
  end

end
