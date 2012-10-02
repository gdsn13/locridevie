window.application.addView((function( $, application ){
  
  function NewsletterView(){
		this.model = null;
		this.view = null;
		this.newsletter_content = null;
		this.jules_container = null;
		this.nl_ul = null;
		this.newsletters = [];
		this.jules = [];
		this.current_index = 0;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.currently_displayed_jules = null;
		this.formulaire_inscription = null;
  };
  
  NewsletterView.prototype.init = function(){  
		var self = this;
		this.model = application.getModel( "Model" );
		this.view = $( '#newsletter_containers' );
		this.newsletter_content = $( '#newsletter_content' );
		this.jules_container = $( '#nwslt_jules_sliders' );
		this.nl_ul = $( '#newsletters' );
		this.formulaire_inscription = $('form[name=newsletter]');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('newsletters_ready', function(){
      self.refreshed_datas();
    });

		/* SUBMIT FORM
		----------------------------------------------------------------------------------------*/
    this.formulaire_inscription.submit(function(e) {
    	e.stopPropagation();
    	e.preventDefault();
			self.model.set_message_to_growl("Inscription...");
    	$.post(
				self.formulaire_inscription.attr('action'),
    		self.formulaire_inscription.serializeArray(),
    		function(data) {
    				if (data.errors == null) {
							self.model.set_message_to_growl("");
    					alert("Merci! Vous allez recevoir notre prochaine newsletter");
    					self.formulaire_inscription.reset();
    				} else{
    					alert("Désolé mais nous n'avons pu traiter cette demande d'inscription.");
							self.model.set_message_to_growl(data.errors);
						}
    			}, 
				"json");
    });
  };

	NewsletterView.prototype.refreshed_datas = function(){
		var self = this;
		this.view.css({'top':"10000px", "display" : "block", "position" : "absolute"});
		
		this.newsletters = this.model.current_page.newsletters
		
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
		//var liste_title = "<li class='opening'>Newsletters</li>";
		//self.nl_ul.append(liste_title);
		$.each(this.newsletters, function(index, n){
			var html = '<li><div class="newsletter_date">' + n.date + '</div><div class="newsletter_title"><a href="/newsletter/' + n.slug + '">' + n.titre + '</a></div></li>';
			self.nl_ul.append(html);
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
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE SI IL Y A PLUSIEUR JULES
				if (self.jules.length > 0){ 
					self.slider_timeout = setTimeout(function(){
						self.animate();
					}, self.slider_duration);
				}
			});
						
			self.model.set_message_to_growl("");
			
		});
	};
	
	NewsletterView.prototype.resize_containers = function(){
		
		var displayed_image = this.currently_displayed_jules;
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.jules_container.find('.jules_slider img').width($(window).width());
			
			this.jules_container.css({	'width': $(window).width(), 
																	'height': displayed_image.height(),
																	'position': 'absolute',
																	'top': '100px',
																	'left': '0'});
																	
			this.view.css('height', displayed_image.height() + $("#newsletter_overview").height() + 130);
																	
			$(".scrollbar").css('display', 'none');
			$(".viewport").css('height', $("#newsletter_overview").height() + 30);
																	
			this.newsletter_content.css({'width': $(window).width(),
																			'top': (displayed_image.height() + 100) + "px",
																			'left': '0',
																			'height': 'auto'
																			});
		}else{
			var top_pos;

			this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.jules_container.find('.jules_slider img').width($(window).width()/2);

			top_pos = ($(window).height() - displayed_image.height())/2;

			this.jules_container.find('.jules_slider').css('top', top_pos);

			this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.newsletter_content.css('width', $(window).width()/2);
			this.newsletter_content.css({'top' : top_pos, 'height' : displayed_image.height()});
			this.newsletter_content.find('.viewport').css('height', displayed_image.height() - 10);
			this.newsletter_content.tinyscrollbar({lockscroll: true});
			
		}
	};
	
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	NewsletterView.prototype.animate = function( ){
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
	NewsletterView.prototype.hide_view = function(){
		var self = this;
		clearTimeout(self.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast');
		$(window).unbind('resize');
		this.jules = [];
		this.current_index = 0;
		this.jules_container.html("");
		this.nl_ul.html("");
	};

	// I get called when the view needs to be shown.
  NewsletterView.prototype.show_view = function( p_parameters ){
		this.view.stop();
    this.check();
		this.model.get_newsletters();
  };

	// I check if everything is ok for the correct display of the view.
	NewsletterView.prototype.check = function(){		
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

  return( new NewsletterView() );
  
})( jQuery, window.application ));