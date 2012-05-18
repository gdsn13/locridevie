window.application.addView((function( $, application ){
  
  function ProgrammationView(){
		this.model = null;
		this.view = null;
		this.programmation_content = null;
		this.jules_container = null;
		this.spectacle_ul = null;
		
		this.localize = null;
		this.jules = [];
		this.current_index = 0;
		this.slider_timeout = null;
		this.slider_duration = 5000;
  };
  
  ProgrammationView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.view = $('#programmation_container');
		this.programmation_content = $('#programmation_content')
		this.jules_container = $('#jules_sliders');
		this.spectacle_ul = $('#programmation_spectacles')
		
		this.template = $('#spectacle_list_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_ready', function(){
      self.refreshed_datas();
    });
  };

	ProgrammationView.prototype.refreshed_datas = function(){
		var self = this;
		this.jules = [];
		this.current_index = 0;
		this.jules_container.html("");
		$(window).unbind('resize');
		
		//INITIALISATION DES TAILLES DES CONTAINERS
		this.jules_container.css({'width': $(window).width()/2, 'height' : "100%"});
		this.programmation_content.css('width', $(window).width()/2);
		
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){
						
			var html = '<div class="jules_slider" id="image_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#image_' + index);
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
		
		//AFFICHAGE DE LA LISTE DES SPECTACLES
		$.each(this.model.spectacles, function(index, s){
			var html = '<li><span>' + s.numero + '</span> <a href="/#/spectacle/' + s.slug + '">' + s.titre + '</a></li>';
			self.spectacle_ul.append(html);
		});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.model.set_message_to_growl("");			// on cache le loader
			self.resize_containers();

			self.view.fadeTo(1, 'slow');							// on affiche la vue
			
			$(window).on('resize', function(){ self.resize_containers();self.resize_containers(); });			
			
			// LANCEMENT DU JULES SLIDER
			self.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
				self.animate("next");
			}, self.slider_duration);
		});
	};
	
	ProgrammationView.prototype.resize_containers = function(){
		var first_image = this.jules_container.find('img').first();
		
		var top_pos = ($(window).height() - first_image.height())/2;
		
		this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
		this.programmation_content.css('width', $(window).width()/2);
		this.programmation_content.css({'top' : top_pos, 'height' : first_image.height()});
		this.programmation_content.find('.viewport').css('height', first_image.height() - 10);
		this.programmation_content.tinyscrollbar({lockscroll: true});
	};
	
	// SERT A RESIZER L IMAGE DE BACKGROUND POUR FULL BACKGROUND
	ProgrammationView.prototype.resize = function(p_container, p_img) {
		p_img.width($(window).width()/2);
		var top_pos = ($(window).height() - p_img.height())/2;
		p_container.css('top', top_pos);
	};
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	ProgrammationView.prototype.animate = function( p_way ){
		var saved_index = this.current_index;
		var self = this;
		
		switch(p_way){
			case "next":
				this.current_index == this.jules.length - 1 ? this.current_index = 0 : ++this.current_index;
				break;
			case "prev":
				this.current_index == 0 ? this.current_index = this.jules.length - 1 : --this.current_index;
				break;
		}
		
		this.jules[saved_index].animate( {opacity:0}, 'fast' );
		this.jules[this.current_index].animate( {opacity:1}, 'fast' );

		this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
			self.animate("next");
		}, this.slider_duration);
	};
	
	// tout réinitialiser! pour le prochain affichage!!!
	ProgrammationView.prototype.hide_view = function(){
		var self = this;
		clearTimeout(self.slider_timeout);
		this.slider_timeout = null;
		this.view.stop().fadeOut('fast');
	};

  // I get called when the view needs to be shown.
  ProgrammationView.prototype.show_view = function( p_parameters ){
    this.check();
		this.current_ordering = p_parameters.id;
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_spectacles(application.currentLocation, this.current_ordering);
  };

	// I check if everything is ok for the correct display of the view.
	ProgrammationView.prototype.check = function(){
		
		
		
		$('#logo_menu').show('fast');
		
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
	
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if (this.localize == null) {
			this.localize = application.getModel( "Localize" );
		}
	};
  // Return a new view class singleton instance.
  return( new ProgrammationView() );
  
})( jQuery, window.application ));