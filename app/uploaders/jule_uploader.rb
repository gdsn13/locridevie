class JuleUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  def store_dir
    self.build_store_dir('contents', 'jules', model.id)
  end


  version :thumb do
    process :resize_to_fill => [200,200]
  end
end