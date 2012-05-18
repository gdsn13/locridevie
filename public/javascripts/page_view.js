window.application.addView((function( $, application ){
  
  function PageView(){
		this.model = null;
		this.view = null;
		this.content_view = null;
		this.jules_container = null;
		this.content_container = null;
		this.jules = [];
  };
  
  PageView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.jules_container = $('#jules_list');
		this.model = application.getModel( "Model" );
		this.content_view = $('#contents');
		this.view = $('#pages');
		this.content_container = $('#content_static_container');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on( 'page_ready', function(){
			self.data_ready();
    });
  };

	PageView.prototype.data_ready = function(){
		var self = this;
		self.jules_container.html("");
		self.content_container.html("");
		self.jules = [];
		
		//INITIALISATION DES TAILLES DES CONTAINERS
		this.jules_container.css({'width': $(window).width()/2, 'height' : "100%"});
		this.content_view.css('width', $(window).width()/2);
		
		// AFFICHAGE DES DIFFERENTS ELEMENT DE LA PAGE
  	//self.display_jules();
		//self.display_body();
		
		this.view.imagesLoaded(function( $images, $proper, $broken ){
			self.view.animate({opacity:1}, 'fast');
		});
		
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){						
			var html = '<div class="jules_slider" id="jules_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#jules_' + index);
			if (index > 0) this_container.css('opacity', 0);				//opacity à 0 sauf pour la premiere image
			self.jules.push(this_container);
		});
		
		// RESIZE LES IMAGES UNE FOIS CHARGEE. on repasse par une boucle pour ajouter directement les images au DOM et
		// et éviter de déclancher le imagesLoaded avant qu'elles ne soient chargées
		this.jules_container.find('img').load(function(){
			var img = this;
			//$(this).css('opacity', 0);
			self.resize($(this).parent(), $(this));
			// SUIVRE LE RESIZE DE WINDOWS
			$(window).on('resize', function(){
				self.resize($(img).parent(), $(img));
			});
		});
		
		this.content_container.html(this.model.current_page.body);
		
		this.view.imagesLoaded(function(){
			$(window).on('resize', function(){
				self.resize_containers();
			});
			
			self.model.set_message_to_growl("");			// on cache le loader
			
			//INIT DES POS DES CONTAINERS
			self.resize_containers();
			
			//INIT DE LA ZONE DE SCROLL
			self.content_view.tinyscrollbar({lockscroll: true});
			
			// ON AFFICHE LA VUE
			self.view.animate({opacity:1},'fast', function(){
			
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
				/*self.slider_timeout = setTimeout(function(){
					self.animate("next");
					}, self.slider_duration);*/
			});
			
		});
		
	};
	
	PageView.prototype.resize_containers = function(){
		var first_image = this.jules_container.find('img').first();
		var top_pos = ($(window).height() - first_image.height())/2;
		
		this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
		this.content_view.css('width', $(window).width()/2);
		this.content_view.css({'top' : top_pos, 'height' : first_image.height()});
		this.content_view.find('.viewport').css('height', first_image.height() - 10);
		this.content_view.tinyscrollbar({lockscroll: true});
	};
	
	PageView.prototype.resize = function(p_container,p_img) {		
		p_img.width($(window).width()/2);
		var top_pos = ($(window).height() - p_img.height())/2;
		p_container.css('top', top_pos);
	};
	
	PageView.prototype.hide_view = function(){
		var self = this;
		this.view.fadeOut('fast', function(){});
	};
	
	PageView.prototype.show_view = function(){
		this.check();
		this.model.get_page(application.currentLocation.slice(application.currentLocation.indexOf("/"), application.currentLocation.length));
	};
	
	// I check if everything is ok for the correct display of the view.
	PageView.prototype.check = function(){
		var menu = $('#logo_menu');
		$( window ).unbind();
		//check que le slider soit bien affiché
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(menu.css('display') == 'none'){
			menu.show();
		}
		this.view.css({'display' : 'block', 'opacity' : '0'});
	};
  
  // Return a new view class singleton instance.
  return( new PageView() );
  
})( jQuery, window.application ));