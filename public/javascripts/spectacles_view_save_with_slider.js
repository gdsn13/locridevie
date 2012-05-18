window.application.addView((function( $, application ){
  
  function SpectaclesView(){
		this.model = null;
		this.view = null;
		this.current_ordering = null;
		this.spectacles = null;
		this.template = null;
		this.current_month_for_calendar_display = null;
		this.localize = null;
		this.jules_container = null;
		this.spectacle_slider = null;
		this.spectacle_slider_ul = null;
		this.spectacles_titles = null;
		this.nav_width = 0;
		this.loaded_images = 0;
		this.mouseX = 0;
		this.enter_frame_nav = null;
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

		this.spectacle_slider.hover(function(){
			$(this).stop().animate({bottom: "0"}, 'fast');
		}, function(){
			$(this).stop().animate({bottom: "-140px"}, 'fast');
		});
		
		this.center_buttons();
		
		// Lors d'un clic sur les boutons de navigation, on arrete le timer.
		this.slide_left_btn.on( 'click', function(){ 
			self.animate( "prev" ); 
			self.auto = false; 
			clearTimeout(self.slider_timeout);
		});
		this.slide_right_btn.on( 'click', function(){ 
			self.animate( "next" ); 
			self.auto = false; 
			clearTimeout(self.slider_timeout);
		} );
  };

	SpectaclesView.prototype.refreshed_datas = function(){
		var self = this;
		this.jules = [];
		this.current_index = 0;
		
		switch(this.current_ordering){
			case 'programmation':
				this.spectacles = this.model.spectacles_ordered_by_name();
			break;
			case 'calendrier':
				this.spectacles = this.model.spectacles_ordered_by_date();
			break;
			case 'la-criee-en-tournee':
				this.spectacles = this.model.spectacles_en_tournee();
			break;
		}
		
		if (this.spectacles != []){
			this.display_spectacles();
		}else{
			//TODO GROWL ERROR
			alert ('error specatcle no spectacle');
		}
	};
	
	SpectaclesView.prototype.display_spectacles = function(){
		var self = this;
		
		//AFFICHAGE DES JULES ET DE LA NAVIGATION
		this.display_jules();
		this.display_nav();				
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.model.set_message_to_growl("");	// on cache le loader
			self.view.fadeIn('slow');	// on affiche la vue
			
			// INITIALISATION DE LA POSITION DES TITRES
			self.spectacle_slider_ul.find('li a').each(function(){
				var tltp = $('#s_' + $(this).attr('rel')); //initialisation de la position des titres.
				var midle = (tltp.width() - $(this).width() + 12)/2;	// + 12 = padding + border, 5 + 5 +1 +1
				var left = $(this).offset().left - midle
				
				if (left < 10) left = 10; 	//cas des bordures
				else if (left + tltp.width() > self.nav_width) left = left - tltp.width() - 10;
								
				tltp.css({'top' : "-50px", 'left' : left});	// positionnement du titre
			});
			
			// INITIALISATION DU MOUVEMENT DES SPECTACLES
			self.spectacle_slider_ul.hover(function( e ){
				self.mouseX = e.pageX;	//sauvegarde de la position de la sourie
				self.spectacle_slider_ul.bind('mousemove', function(e){ self.mouseX = e.pageX; });//on coute le déplacement de la sourie pour changer la valeur de la sourie
				self.mouse_move_on_nav( e );	//on lance le déplacement
			},function( e ){
				clearTimeout(self.enter_frame_nav);	//on arrete le onframe
				self.spectacle_slider_ul.unbind('mousemove', self.mouse_move); //on arrete d'écouter les mouvements de la sourie
			});
			
			// LANCEMENT DU FULL-SLIDER
			self.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
				self.animate("next");
			}, self.slider_duration);
			
			// INITIALISATION POSITION DU SLIDER_NAV
			self.slider_nav.css({'margin-left' : -(self.slider_nav.width()/2)});
		});
		
		// ---------------------------------------------------------------------------------------------------------
	};
		
	// MOUVEMENT DE LA LISTE DES SPECTACLES
	SpectaclesView.prototype.mouse_move_on_nav = function( ){
		var self = application.getView( "SpectaclesView" );;
		var speed = 0;
    var wdth = 0;

    $(window).width() < 980 ? wdth = 980 : wdth = $(window).width();	//pour la largeur minimale du site

    var deadZoneLeft = parseInt(0.15 * wdth);	//calcul des limites
    var deadZoneRight = wdth - deadZoneLeft;
    var left = self.spectacle_slider_ul.position().left;
    var limitRight = self.nav_width - $(window).width();
    
    if (self.mouseX < deadZoneLeft) speed = Math.abs((self.mouseX - wdth/2)/60);	//calcul de la vistesse
    if (self.mouseX > deadZoneRight) speed = -(self.mouseX - wdth/2)/60;
    
    pos = parseInt(left + speed);

    if (pos <= 0 && pos > -limitRight) {
			self.spectacle_slider_ul.css('left', pos);
			self.spectacles_titles.css('left', pos);
		}
		//on appelle tout le temps cette fonction, tant que la sourie est dans le slider.
		self.enter_frame_nav = setTimeout(self.mouse_move_on_nav, 30);
	};

	// AFFICHAGE DE LA LISTE DES SPECTACLE EN NAV
	SpectaclesView.prototype.display_nav = function(){
		var self = this;
		this.nav_width = 0;
		this.loaded_images = 0;
		
		// POPULATE SPECTACLE LIST
		$.each(this.spectacles, function(index, spec){
			if (self.current_ordering == "calendrier"){
				var month = new Date(spec.date).getMonth();
				if(self.current_month_for_calendar_display != month){
					self.current_month_for_calendar_display = month;
					self.spectacle_slider_ul.append('<li class="month_name_for_calendar">' + self.localize.localize_month(month) + '</li>');
				}
			}
			spec["index"] = index;
			self.spectacle_slider_ul.append(application.getFromTemplate(self.template, spec));
			self.spectacles_titles.append("<div id='s_" + index + "' >" + spec.titre + "<span></span></div>");
		});
		
		// LOAD THE NAV IMAGES
		self.spectacle_slider_ul.find('li img').load(function(){
			$(this).css('height', 170);
			self.nav_width += (this.width * 170 / this.height) + 5;
			self.loaded_images ++;
			
			if (self.loaded_images == self.spectacles.length){	//set size du ul des slepcatcles et des titres
				self.spectacle_slider_ul.css('width', self.nav_width);
				self.spectacles_titles.css('width', self.nav_width);
			}
		});
		
		// ANIMATION DES THUMBS ET TITRES SUR MOUSE OVER
		$('.spectacle_thumb').hover(function(){			
			var tltp = $('#s_' + $(this).attr('rel'));
			$(this).find('img').stop().animate({marginTop : "-15px"}, 'fast');
			tltp.stop().fadeIn('fast');
		}, function(){
			var tltp = $('#s_' + $(this).attr('rel'));
			$(this).find('img').stop().animate({marginTop : "0px"}, 'fast');
			tltp.stop().fadeOut('fast');
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

	SpectaclesView.prototype.display_jules = function(){
		var self = this;
				
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
	};
	
	// tout réinitialiser! pour le prochain affichage!!!
	SpectaclesView.prototype.hide_view = function(){
		var self = this;
		this.view.stop().hide('fast', function(){
			self.spectacle_slider_ul.html("");
			self.spectacles_titles.html("");
			self.jules_container.html("");
			self.slider_nav.html("");
			self.enter_frame_nav = null;
			self.jules = [];
			self.current_index = 0;
			self.slider_timeout = null;
			self.nav_indicators = [];
			self.auto = true;
			self.loaded_images = 0;
			self.mouseX = 0;
		});
	};

  // I get called when the view needs to be shown.
  SpectaclesView.prototype.show_view = function( p_parameters ){
    this.check();
		this.current_ordering = p_parameters.id;
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_spectacles(application.currentLocation);
  };

	// I check if everything is ok for the correct display of the view.
	SpectaclesView.prototype.check = function(){
		
		//est remplie au moment ou les données sont ok.
		this.spectacles = [];
		$('#logo_menu').show('fast');
		
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