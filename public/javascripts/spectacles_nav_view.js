window.application.addView((function( $, application ){
  

	/*
	/		Affiche le menu du bas. normalement
	/		Utilise show_view pour afficher en mode accueil! et hide view pour revenir à la normale
	/	
	/
	/ ----------------------------------------------------------------------------------------*/

  function SpectaclesNavView(){
		this.model = null;
		this.spectacles = null;
		this.template = null;
		this.localize = null;
		this.spectacle_slider = null;
		this.spectacle_slider_ul = null;
		this.spectacles_titles = null;
		this.nav_width = 0;
		this.loaded_images = 0;
		this.mouseX = 0;
		this.enter_frame_nav = null;
		this.tltp_template = null;
		this.lock_up_and_down = false;
  };
  
  SpectaclesNavView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.spectacle_slider = $('#spectacle_slider');
		this.template = $('#spectacle_list_template');
		this.spectacle_slider_ul = $('#spectacle_slider > ul');
		this.spectacles_titles = $('#spectacles_titles');
		this.tltp_template = $('#tltp_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_list_ready', function(){
      self.refreshed_datas();
    });
		
		this.spectacle_slider.hover(function(){
			if (self.lock_up_and_down == false){
				$(this).stop().animate({bottom: "0"}, 'fast');
			}
		}, function(){
			if (self.lock_up_and_down == false && self.model.home_page_is_displayed == false){
				$(this).stop().animate({bottom: "-165px"}, 'fast');
			}
		});
		
		$(this.model).on('menu_is_displaying', function(){
			self.lock_up_and_down = true;
			self.spectacle_slider.stop().animate({bottom: "0"}, 'fast');
		});
		
		$(this.model).on('menu_is_hidding', function(){
			self.hide_menu();
		});
		
		//TODO => Mettre dans le resize
		this.spectacle_slider.css('width', $(window).width());
  };

	SpectaclesNavView.prototype.hide_menu = function(){
		var pos_to_slide = "-165px";
		if (application.currentLocation == "home_page"){
			pos_to_slide = ($(window).height() - this.spectacle_slider.height())/2
		}
		this.spectacle_slider.stop().animate({bottom: pos_to_slide}, 'fast');
	};

	SpectaclesNavView.prototype.refreshed_datas = function(){
		var self = this;
		this.enter_frame_nav = null;
		this.loaded_images = 0;
		this.mouseX = 0;
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
				
		this.spectacles = this.model.spectacles_ordered_by_date();
		
		if (this.spectacles != []){
			this.display_spectacles();
		}else{
			alert ('error specatcle no spectacle');
		}
	};
	
	SpectaclesNavView.prototype.display_spectacles = function(){
		var self = this;
		
		//AFFICHAGE DES JULES ET DE LA NAVIGATION
		this.display_nav();				
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.spectacle_slider.imagesLoaded(function($images, $proper, $broken){
			
			self.spectacle_slider.css('opacity', "1");
			
			$(window).unbind();
			
			// INITIALISATION DE LA POSITION DES TITRES
			self.spectacle_slider_ul.find('li a').each(function(){
				var tltp = $('#s_' + $(this).attr('rel')); 							//récupération du tooltip

				var middle = (tltp.width() - $(this).width() + 12)/2;		// + 12 = padding + border, 5 + 5 +1 +1
				var left = $(this).offset().left - middle;
				
				if (left < 10) left = 10; 	//cas des bordures
				//TODO : positionner le titre.
				else if (left + tltp.width() > self.nav_width) xleft = self.nav_width - tltp.width() - 30;			
				
				tltp.css({'left' : left, 'top' : -(tltp.height() + 60)});	// positionnement du titre
			});
			
			//POSITIONNEMENT SUR LA DATE COURANTE
			var current_month = new Date().getMonth();
			var current_year = new Date().getFullYear();
			var current_month_li = self.spectacle_slider_ul.find('#month_' + current_month + '_' + current_year);
			//si le mois de l'année en cours existe 
			if (current_month_li.size() > 0){
				current_month_li.css("background-color", "#1285bc");
				var date_offset = - Math.abs(current_month_li.offset().left);
				//limite à droite
				var limitRight = - (self.nav_width - $(window).width());
				if (date_offset < limitRight) {
					date_offset = limitRight;
				}
			
				self.spectacle_slider_ul.css('left', date_offset);
				self.spectacles_titles.css('left', date_offset);
			}// sinon, on se met au début (on touche rien quoi)
			
			// INITIALISATION DU MOUVEMENT DES SPECTACLES
			self.spectacle_slider_ul.hover(function( e ){
				self.mouseX = e.pageX;	//sauvegarde de la position de la sourie
				self.spectacle_slider_ul.bind('mousemove', function(e){ self.mouseX = e.pageX; });//on coute le déplacement de la sourie pour changer la valeur de la sourie
				self.mouse_move_on_nav( e );	//on lance le déplacement
			},function( e ){
				clearTimeout(self.enter_frame_nav);	//on arrete le onframe
				self.spectacle_slider_ul.unbind('mousemove', self.mouse_move); //on arrete d'écouter les mouvements de la sourie
			});
			
			//ECOUTE DU RESIZE
			$(window).on('resize', function(){
				var limitRight = - (self.nav_width - $(window).width());
				var left_pos = - Math.abs(self.spectacle_slider_ul.position().left);
				
				if (left_pos < limitRight){
					left_pos = limitRight;
				} 
				
				self.spectacle_slider_ul.css('left', left_pos);
				self.spectacles_titles.css('left', left_pos);
			});
			
			Cufon.replace('div.numero_title');
			
			self.spectacle_slider_ul.animate({opacity:1}, 'fast');
		});
		
		// ---------------------------------------------------------------------------------------------------------
	};
		
	// MOUVEMENT DE LA LISTE DES SPECTACLES
	SpectaclesNavView.prototype.mouse_move_on_nav = function( ){
		var self = application.getView( "SpectaclesNavView" );;
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
	SpectaclesNavView.prototype.display_nav = function(){
		var self = this;
		this.nav_width = 0;
		this.loaded_images = 0;
		
		// POPULATE SPECTACLE LIST
		$.each(this.spectacles, function(index, spec){
			//AFFICHAGE DU MOIS DU CALENDRIER
			var month = new Date(spec.date).getMonth();
			var year = new Date(spec.date).getFullYear();
			if(self.current_month_for_calendar_display != month){
				self.current_month_for_calendar_display = month;
				self.spectacle_slider_ul.append('<li class="month_name_for_calendar" id="month_' + month + '_' + year + '"><p><a href="javascript:void();">' + self.localize.localize_month(month) + '</a></p></li>');
				self.nav_width += 45;
			}
			
			//AFFICHAGE DU SPECTACLE
			spec["index"] = index;	//rajout de l'index à l'object
			spec["pipe"] = "";
			if (spec.spectacle_associe_path != "") spec["url"] = spec.spectacle_associe_path;
			else spec["url"] = spec.slug;
			if (spec.date_infobulles != "" && spec.lieu != "") spec["pipe"] = "|"
			self.spectacle_slider_ul.append(application.getFromTemplate(self.template, spec));
			self.spectacles_titles.append(application.getFromTemplate(self.tltp_template, spec));
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
		
		$('.spectacle_thumb').on('click', function(){
			self.hide_view();
			self.lock_up_and_down = false;
			self.model.hide_menu_command();
		});
	};
	
	SpectaclesNavView.prototype.hide_view = function(){
		this.spectacle_slider.stop().animate({bottom: "-165px"}, 'fast', function(){
			this.lock_up_and_down = false;
		});
	};
	
	//AFFICHAGE DE LA VUE EN MODE HOME!
	SpectaclesNavView.prototype.show_view = function(){
		//annulation du comportement normal du up and down.
		$('#logo_menu').show('fast');
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block") menu_btn.css('display', 'block');
		this.spectacle_slider.fadeIn('fast');
		
		this.lock_up_and_down = true;
		
		this.spectacle_slider.stop().animate({bottom: ($(window).height() - this.spectacle_slider.height())/2}, 'fast');
	};

  // Return a new view class singleton instance.
  return( new SpectaclesNavView() );
  
})( jQuery, window.application ));