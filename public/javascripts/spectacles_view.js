window.application.addView((function( $, application ){
  
  function SpectaclesView(){
		this.model = null;
		this.localize = null;
		this.jules_container = null;
		this.slide_left_btn = null;
		this.slide_right_btn = null;
		this.jules = [];
		this.current_index = 0;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.slider_nav = null;
		this.nav_indicators = [];
		this.auto = true;
  };
  
  SpectaclesView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.view = $('#spectacles_container');
		this.jules_container = $('#jules_sliders')
		this.spectacle_slider = $('#spectacle_slider');
		this.template = $('#spectacle_list_template');
		this.spectacle_slider_ul = $('#spectacle_slider > ul');
		this.spectacles_titles = $('#spectacles_titles');
		this.slide_left_btn = $('#slide_left_btn');
		this.slide_right_btn = $('#slide_right_btn');
		this.slider_nav = $('#slider_nav');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_ready', function(){
      self.refreshed_datas();
    });
		
		this.center_buttons();
		
		// Lors d'un clic sur les boutons de navigation, on arrete le timer.
		this.slide_left_btn.on( 'click', function(){  
			self.auto = false; 
			clearTimeout(self.slider_timeout);
			self.animate( "prev" );
		});
		this.slide_right_btn.on( 'click', function(){ 
			self.auto = false; 
			clearTimeout(self.slider_timeout);
			self.animate( "next" ); 
		} );
  };

	SpectaclesView.prototype.refreshed_datas = function(){
		var self = this;
		this.jules = [];
		this.current_index = 0;
		this.jules_container.html("");
		this.slider_nav.html("");
		this.jules = [];
		this.current_index = 0;
		this.nav_indicators = [];
		this.auto = true;
		this.mouseX = 0;
		$(window).unbind('resize');
		
		//AFFICHAGE DES JULES ET DE LA NAVIGATION
		$.each(this.model.current_page.jules, function(index, j){
			
			var html = "<div id='jule_slider_" + index + "' ><div class='jule_slider_img'></div><div class='jule_slider_block'>" + j.block + "</div></div>";
			self.jules_container.append(html);
			self.jules.push(self.jules_container.find('#jule_slider_' + index));
			var first = "";
			if (index == 0) first = "active_indicator";
			self.slider_nav.append("<div class='slider_indicator " + first + "' rel=" + index + "></div>");
			self.nav_indicators.push(self.slider_nav.find('.slider_indicator[rel=' + index + ']'));
			
			var img = new Image();
			var this_container = self.jules_container.find('#jule_slider_' + index + ' .jule_slider_img');
			
	    $(img).load(function(){	
				self.resize(this_container, $(this));
				this_container.html(this);
			}).attr('src', j.picto);
			
			$(window).on('resize', function(){ self.resize(this_container, $(img));	});
		});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.model.set_message_to_growl("");	// on cache le loader
			self.view.fadeIn('slow');	// on affiche la vue
			
			// LANCEMENT DU FULL-SLIDER
			self.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
				self.animate("next");
			}, self.slider_duration);
			
			// INITIALISATION POSITION DU SLIDER_NAV
			self.slider_nav.css({'margin-left' : -(self.slider_nav.width()/2)});
		});
	};
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	SpectaclesView.prototype.animate = function( p_way ){
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
		
		this.jules[saved_index].fadeOut('fast');
		this.nav_indicators[saved_index].removeClass('active_indicator');
		this.jules[this.current_index].fadeIn('fast');
		this.nav_indicators[this.current_index].addClass('active_indicator');
		
		if (this.auto == true){
			this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
				self.animate("next");
			}, this.slider_duration);
		}
	};
	
	// tout réinitialiser! pour le prochain affichage!!!
	SpectaclesView.prototype.hide_view = function(){
		var self = this;
		clearTimeout(self.slider_timeout);
		this.slider_timeout = null;
		this.view.stop().hide('fast');
	};

  // I get called when the view needs to be shown.
  SpectaclesView.prototype.show_view = function( p_parameters ){
    this.check();
		this.current_ordering = p_parameters.id;
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_spectacles(application.currentLocation, this.current_ordering);
  };

	// I check if everything is ok for the correct display of the view.
	SpectaclesView.prototype.check = function(){
		
		//est remplie au moment ou les données sont ok.
		this.spectacles = [];
		$('#logo_menu').show('fast');
		
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast');
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_btn.css('display', 'block');
		var menu_bis = $('#menu_important');
		if (menu_bis.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_bis.css('display', 'block');
		
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if (this.localize == null) {
			this.localize = application.getModel( "Localize" );
		}
	};
  
	// SERT A RESIZER L IMAGE DE BACKGROUND POUR FULL BACKGROUND
	SpectaclesView.prototype.resize = function(p_container, p_img) {
		//Define starting width and height values for the original image
		var start_width = p_img.width();  
		var start_height = p_img.height();
		//Define image ratio
		var ratio = start_height/start_width;
		//Gather browser dimensions
		var browser_width = $(window).width();
		var browser_height = $(window).height();
		//Resize image to proper ratio
		if ((browser_height/browser_width) > ratio) {
			p_container.height(browser_height);
		  p_container.width(browser_height / ratio);
		  p_img.height(browser_height);
		  p_img.width(browser_height / ratio);
		} else {
		  p_container.width(browser_width);
		  p_container.height(browser_width * ratio);
		  p_img.width(browser_width);
		  p_img.height(browser_width * ratio);
	  }
		
		//Make sure the image stays center in the window
		p_img.css('left', (browser_width - p_container.width())/2);
		p_img.css('top', (browser_height - p_container.height())/2);
	
		this.center_buttons();
	};
	
	SpectaclesView.prototype.center_buttons = function(){
		this.slide_left_btn.css('top', ($(window).height() - this.slide_left_btn.height())/2);
		this.slide_right_btn.css('top', ($(window).height() - this.slide_right_btn.height())/2);
	};

  // Return a new view class singleton instance.
  return( new SpectaclesView() );
  
})( jQuery, window.application ));