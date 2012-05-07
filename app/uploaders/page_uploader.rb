class PageUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  def store_dir
    self.build_store_dir('contents', 'pages', model.id)
  end


  version :thumb do
    process :resize_to_fill => [150,150]
  end
  
  version :medium do
    process :resize_to_fill => [800,800]
  end
end
