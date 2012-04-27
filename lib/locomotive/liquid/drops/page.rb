module Locomotive
  module Liquid
    module Drops
      class Page < Base

        delegate :seo_title, :meta_keywords, :meta_description, :to => '_source'

        def title
          self._source.templatized? ? @context['content_instance'].highlighted_field_value : self._source.title
        end

        def slug
          self._source.templatized? ? self._source.content_type.slug.singularize : self._source.slug
        end
        
        def parent
          @parent ||= self._source.parent.to_liquid
        end
        
        def breadcrumbs
          @breadcrumbs ||= liquify(*self._source.self_and_ancestors)
        end

        def children
          @children ||= liquify(*self._source.children)
        end

        def fullpath
          @fullpath ||= self._source.fullpath
        end

        def depth
          self._source.depth
        end
        
        def jules
          jules = []
          self._source.embeded_items.jules.each { |jl| jules << Jule.find(jl.item_id) }
                  
          jules = jules.collect{ |j| j.attributes }
        end
        
        def buttons
          but = []
          self._source.embeded_items.boutons.each { |btn| but << Bouton.find(btn.item_id) }
          
          but = but.collect{ |b| b.attributes }
        end
        
        def actus
          acts = []
          self._source.embeded_items.actus.each { |act| acts << Actu.find(act.item_id) }
          
          acts = acts.collect{ |a| a  .attributes }
        end
        
        def listed?
          self._source.listed?
        end
        
        def published?
          self._source.published?
        end

      end
    end
  end
end
