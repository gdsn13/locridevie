require 'carrierwave/processing/mini_magick'

# Custom options for CustomFields
CustomFields.options = {
  :reserved_aliases => Mongoid.destructive_fields + %w(created_at updated_at)
}

# Set correct paths
module CustomFields
  module Types
    module File
      class FileUploader < ::CarrierWave::Uploader::Base

        include CarrierWave::MiniMagick
        include CarrierWave::MimeTypes
        
        process :set_content_type
        
        version :thumb, :if => :image? do
          process :resize_to_fit => [50, 50]
        end
        
        version :menu, :if => :image? do
          process :resize_to_fit => [170, 170]
        end

        def store_dir
          "contents/#{model.class.model_name.underscore}/#{model.id}"
        end

        def cache_dir
          "#{Rails.root}/tmp/uploads"
        end
        
        protected
          def image?(new_file)
            new_file.content_type.include? 'image'
          end
        
      end
    end
    
    module Picture
      class PictureUploader < ::CarrierWave::Uploader::Base
        include CarrierWave::MiniMagick
        
        def store_dir
          "contents/#{model.class.model_name.underscore}/#{model.id}"
        end

        def cache_dir
          "#{Rails.root}/tmp/uploads"
        end
        
        version :thumb do
          process :resize_to_fit => [50, 50]
        end
        
        version :vignette do
          process :resize_to_fit => [100, 100]
        end
        
        version :iphone do 
          process :resize_to_fit => [900, 900]
        end

        def extension_white_list
          %w(jpg jpeg gif png swf flv)
        end
        
      end
    end

    module Category
      class Item

        def to_liquid
          { 'id' => self._id.to_s, 'name' => self.name }
        end

      end
    end
  end
end

