module Admin
  class ContentTypesController < BaseController

    sections 'objects'

    def destroy
      destroy! { admin_object_contents_url }
    end

  end
end
