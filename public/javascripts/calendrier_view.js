window.application.addView((function( $, application ){
  
  function CalendrierView(){
		this.model = null;
		this.view = null;
  };
  
  CalendrierView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.view = $('#programmation_container');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_ready', function(){
      self.refreshed_datas();
    });
  };

	CalendrierView.prototype.refreshed_datas = function(){
		var self = this;
		this.view.css({'top':"10000px", "display" : "block"});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){

			self.view.css({'top':"0px", "display" : "none"});
			
			$(window).on('resize', function(){ self.resize_containers(); });			
			
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
			});
			
			self.model.set_message_to_growl("");
			
		});
	};
	
	CalendrierView.prototype.resize_containers = function(){

	};
	
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	CalendrierView.prototype.animate = function( ){
		var saved_index = this.current_index;
		var self = this;
		
		this.current_index == this.jules.length - 1 ? this.current_index = 0 : ++this.current_index;
		
		this.jules[saved_index].fadeOut( 'fast' );
		this.jules[this.current_index].fadeIn( 'fast' );
		this.currently_displayed_jules = this.jules[this.current_index].find('img').first(); 

		this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
			self.animate();
		}, this.slider_duration);
	};
	
	// tout réinitialiser! pour le prochain affichage!!!
	CalendrierView.prototype.hide_view = function(){
		var self = this;
		this.view.fadeOut('fast');
		$(window).unbind('resize');
	};

  // I get called when the view needs to be shown.
  CalendrierView.prototype.show_view = function( p_parameters ){
		this.view.stop();
    this.check();
		this.current_ordering = p_parameters.id;
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_spectacles(application.currentLocation, this.current_ordering);
  };

	// I check if everything is ok for the correct display of the view.
	CalendrierView.prototype.check = function(){		
		$('#logo_menu').show('fast');
		
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
	
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
  // Return a new view class singleton instance.
  return( new CalendrierView() );
  
})( jQuery, window.application ));