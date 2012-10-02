window.application.addView((function( $, application ){
  
  function ProgrammationView(){
		this.model = null;
		this.view = null;
		this.programmation_content = null;
		this.jules_container = null;
		this.spectacle_ul = null;
		this.spectacles = null;
		this.localize = null;
		this.jules = [];
		this.current_index = 0;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.currently_displayed_jules = null;
  };
  
  ProgrammationView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.view = $('#programmation_container');
		this.programmation_content = $('#programmation_content');
		this.jules_container = $('#jules_sliders');
		this.spectacle_ul = $('#programmation_spectacles');
		
		this.template = $('#spectacle_list_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_ready', function(){
      self.refreshed_datas();
    });
  };

	ProgrammationView.prototype.refreshed_datas = function(){
		var self = this;
		this.view.css({'top':"10000px", "display" : "block", "position" : "absolute"});
		
		this.spectacles = this.model.spectacles_ordered_by_numero();
		
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){
			var html = '<div class="jules_slider" id="image_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#image_' + index);
			self.jules.push(this_container);
			if (index == 0) self.currently_displayed_jules = this_container.find('img').first();
			else this_container.css('display', 'none');
		});
		
		//AFFICHAGE DE LA LISTE DES SPECTACLES
		var liste_title = "<li class='opening'>Programmation</li>";
		self.spectacle_ul.append(liste_title);
		$.each(this.spectacles, function(index, s){
			if (s.spectacle_associe_path == ""){
				var html = '<li><div class="spectacle_list_numero">' + s.numero + '</div><div class="spectacle_list_title"><a href="/#/spectacle/' + s.slug + '">' + s.titre + '</a></div>';
				html += '<div class="headline">' + s.info_prog + '</div</li>';
				self.spectacle_ul.append(html);
			}
		});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.resize_containers();

			if (Modernizr.mq('(max-width: 640px)') == true){
				self.view.css({'top':"0px", "display" : "none", "position" : "static"});
			}else{
				self.view.css({'top':"0px", "display" : "none"});	
			}
			
			$(window).on('resize', function(){ self.resize_containers(); });			
			
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				if (Modernizr.mq('(max-width: 640px)') == true){
					$('#menu').css('display', 'block');
				}
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
				if (self.jules.length > 0){ 
					self.slider_timeout = setTimeout(function(){
						self.animate();
						}, self.slider_duration);	
				}
			});
			
			Cufon.replace('.spectacle_list_numero');
			
			self.model.set_message_to_growl("");
			
		});
	};
	
	ProgrammationView.prototype.resize_containers = function(){
		
		var displayed_image = this.currently_displayed_jules;
		
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.jules_container.find('.jules_slider img').width($(window).width());
			
			this.jules_container.css({	'width': $(window).width(), 
																	'height': displayed_image.height(),
																	'position': 'absolute',
																	'top': '100px',
																	'left': '0'});
																	
			this.view.css('height', displayed_image.height() + this.spectacle_ul.height() + 130);
																	
			$(".scrollbar").css('display', 'none');
			$(".viewport").css('height', this.spectacle_ul.height() + 30);
																	
			this.programmation_content.css({'width': $(window).width(),
																			'top': (displayed_image.height() + 100) + "px",
																			'left': '0',
																			'height': 'auto'
																			});
		}
		else{
			var top_pos;

			this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.jules_container.find('.jules_slider img').width($(window).width()/2);

			top_pos = ($(window).height() - displayed_image.height())/2;

			this.jules_container.find('.jules_slider').css('top', top_pos);

			this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.programmation_content.css('width', $(window).width()/2);
			this.programmation_content.css({'top' : top_pos, 'height' : displayed_image.height()});
			this.programmation_content.find('.viewport').css('height', displayed_image.height() - 10);
			this.programmation_content.tinyscrollbar({lockscroll: true});
		}
	};
	
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	ProgrammationView.prototype.animate = function( ){
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
	ProgrammationView.prototype.hide_view = function(){
		var self = this;
		clearTimeout(self.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast');
		$(window).unbind('resize');
		this.jules = [];
		this.current_index = 0;
		this.jules_container.html("");
		this.spectacle_ul.html("");
	};

  // I get called when the view needs to be shown.
  ProgrammationView.prototype.show_view = function( p_parameters ){
		this.view.stop();
    this.check();
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_spectacles(application.currentLocation);
  };

	// I check if everything is ok for the correct display of the view.
	ProgrammationView.prototype.check = function(){		
		$('#logo_menu').show('fast');
		
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_btn.css('display', 'block');
				
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