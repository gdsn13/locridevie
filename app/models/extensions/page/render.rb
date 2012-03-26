module Extensions
  module Page
    module Render
      
      extend ActiveSupport::Concern
      
      included do
        field :rendering, :type => String
      end

      def render(context)
        self.template.render(context)
      end

    end
  end
end