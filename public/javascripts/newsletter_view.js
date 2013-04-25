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
		this.search_form = null;
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

		//AFFICHAGE DU FORMULAIRE DE RECHERCHE
		this.search_form = $('form[name=search]');
		this.search_form.submit(function(e){
			e.stopPropagation();
    	e.preventDefault();
			self.model.query_string = $(this).serializeArray();
			$(this).find("input[name=query_string]").val("");
			
			self.model.set_message_to_growl("Recherche...");
			if (location.hash != "#/search"){
				location.hash = "#/search";
			}else{
				self.model.get_search_results();
			}
			
			return false;
		});
  };

	NewsletterView.prototype.refreshed_datas = function(){
		var self = this;
		
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
		
		//AFFICHAGE DE LA LISTE DES NEWSLETTER
		$.each(this.newsletters, function(index, n){
			if(n.publie == true){
				var html = '<li><div class="newsletter_date">' + n.date + '</div><div class="newsletter_title"><a href="/newsletter/' + n.slug + '">' + n.titre + '</a></div></li>';
				self.nl_ul.append(html);
			}
		});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE SI IL Y A PLUSIEUR JULES
				if (self.jules.length > 1){ 
					self.slider_timeout = setTimeout(function(){
						self.animate();
					}, self.slider_duration);
				}
			});
						
			self.model.set_message_to_growl("");
		});
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
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};

  return( new NewsletterView() );
  
})( jQuery, window.application ));