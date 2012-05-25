window.application.addView((function( $, application ){
  
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
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_list_ready', function(){
      self.refreshed_datas();
    });

		this.spectacle_slider.hover(function(){
			$(this).stop().animate({bottom: "0"}, 'fast');
		}, function(){
			$(this).stop().animate({bottom: "-165px"}, 'fast');
		});
		
		this.spectacle_slider.css('width', $(window).width());
  };

	SpectaclesNavView.prototype.refreshed_datas = function(){
		var self = this;
		this.spectacle_slider_ul.html("");
		this.spectacles_titles.html("");
		this.enter_frame_nav = null;
		this.loaded_images = 0;
		this.mouseX = 0;
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		
		this.spectacle_slider_ul.animate({opacity:0}, 'fast');
		this.spectacle_slider_ul.css('left', 0);
		this.spectacles_titles.css('left', 0);
		
		switch(this.model.current_ordering){
			case 'programmation':
				this.spectacles = this.model.spectacles_ordered_by_name();
			break;
			case 'calendrier':
				this.spectacles = this.model.spectacles_ordered_by_date();
			break;
			case 'la-criee-en-tournee':
				this.spectacles = this.model.spectacles_en_tournee();
			break;
			default:
				this.spectacles = this.model.spectacles_ordered_by_date();
			break;
		}
		
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
			
			$(window).unbind();
			
			// INITIALISATION DE LA POSITION DES TITRES
			self.spectacle_slider_ul.find('li a').each(function(){
				var tltp = $('#s_' + $(this).attr('rel')); 							//récupération du tooltip
				var middle = (tltp.width() - $(this).width() + 12)/2;		// + 12 = padding + border, 5 + 5 +1 +1
				var left = $(this).offset().left - middle;
				
				if (left < 10) left = 10; 	//cas des bordures
				//TODO : positionner le titre.
				else if (left + tltp.width() > self.nav_width) xleft = self.nav_width - tltp.width() - 20;
								
				tltp.css({'left' : left});	// positionnement du titre
			});
			
			//POSITIONNEMENT SUR LA DATE COURANTE
			var current_month = new Date().getMonth();
			var current_month_li = self.spectacle_slider_ul.find('#month_' + current_month);
			current_month_li.css("background-color", "#1285bc");
			var date_offset = current_month_li.offset().left;
			//limite à droite
			var limitRight = self.nav_width - $(window).width();
			if (date_offset > -limitRight) date_offset = limitRight;
			
			self.spectacle_slider_ul.css('left', - date_offset);
			self.spectacles_titles.css('left', - date_offset);
			
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
				console.log('resize');
				var limitRight = - (self.nav_width - $(window).width());
				var left_pos = - Math.abs(self.spectacle_slider_ul.position().left);
				console.log('lr' + limitRight);
				console.log('lp' + left_pos);
				
				if (left_pos < limitRight){
					console.log('limit riched');
					left_pos = limitRight;
				} 
				console.log('nlr' + limitRight);
				console.log('nlp' + left_pos);

				self.spectacle_slider_ul.css('left', left_pos);
				self.spectacles_titles.css('left', left_pos);
			});
			
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
			if (self.model.current_ordering == "calendrier"){
				var month = new Date(spec.date).getMonth();
				if(self.current_month_for_calendar_display != month){
					self.current_month_for_calendar_display = month;
					self.spectacle_slider_ul.append('<li class="month_name_for_calendar" id="month_' + month + '"><p><a href="javascript:void();">' + self.localize.localize_month(month) + '</a></p></li>');
					self.nav_width += 45;
				}
			}
			spec["index"] = index;
			self.spectacle_slider_ul.append(application.getFromTemplate(self.template, spec));
			var title = "<div id='s_" + index + "' class='tool_tip_title'><div class='numero_title'>" + spec.numero + "</div>" + spec.titre + "<span class='tltp_arrow'></span></div>";
			self.spectacles_titles.append(title);
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

  // Return a new view class singleton instance.
  return( new SpectaclesNavView() );
  
})( jQuery, window.application ));