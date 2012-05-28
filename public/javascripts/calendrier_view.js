window.application.addView((function( $, application ){
  
  function CalendrierView(){
		this.model = null;
		this.view = null;
		this.calendrier_spectacles = null;
		this.calendrier_content = null;
		this.jules_container = null;
		this.currently_displayed_jules = null;
		this.jules = [];
		this.calendar_line = null;
		this.localize = null;
  };
  
  CalendrierView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.view = $('#calendrier_container');
		this.localize = application.getModel( "Localize" );
		this.calendrier_spectacles = $('#calendrier_spectacles');
		this.calendrier_content = $('#calendrier_content');
		this.jules_container = $('#calendrier_jules_sliders');
		this.calendar_line = $('#calendar_line');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('calendrier_ready', function(){
      self.refreshed_datas();
    });
  };

	CalendrierView.prototype.refreshed_datas = function(){
		var self = this;
		var current_month_for_display = 0;
		this.view.css({'top':"10000px", "display" : "block"});
		
		//AFFICHAGE DES DATES
		$.each(this.model.current_page.dates, function(index, d){
			//AFFICHAGE NOM DU MOIS
			var date = new Date(d.date);
			if (current_month_for_display != date.getMonth()){
				current_month_for_display = date.getMonth();
				self.calendrier_spectacles.append("<li class='month_name'>" + self.localize.localize_month(date.getMonth()) + "</li>");
			} 
			d.humanized_date = self.localize.localize_day(date.getDay()) + " " + date.getDate();
			
			//CALCUL COULEUR DE LA LIGNE
			if (d.green == true) d.color_line = "green_line";
			else if (d.red == true) d.color_line = "red_line";
						
			//CALCUL DES EXTRAS
			var extra = "";
			if (d.tout_public == true) extra += '<img src="/theme/images/tout_public.png" width="15px" align="left"/>';
			if (d.des != "")	extra += '<span class="des">' + d.des + '</span>';
			if (d.temps_scolaire == true) extra += '<img src="/theme/images/temps_scolaire.png" width="15px" align="left"/>';
			if (d.audiodesc == true) extra += '<span class="audiodescription">Audio</span>';
			if (d.lds == true) extra += '<span class="lsf">LSF</span>';

			d.extra = extra
			
			//AFFICHAGE DE LA LIGNE DEPUIS TEMPLATE
			self.calendrier_spectacles.append(application.getFromTemplate(self.calendar_line, d));
		});
		
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){
			var html = '<div class="jules_slider" id="calendrier_jules_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#calendrier_jules_' + index);
			self.jules.push(this_container);
			if (index == 0) self.currently_displayed_jules = this_container.find('img').first();
			else this_container.css('display', 'none');
		});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){

			self.resize_containers();

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
		var displayed_image = this.currently_displayed_jules;
		var top_pos;
		
		this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
		this.jules_container.find('.jules_slider img').width($(window).width()/2);
		
		top_pos = ($(window).height() - displayed_image.height())/2;
		
		this.jules_container.find('.jules_slider').css('top', top_pos);
		
		this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
		
		//var new_width = $(window).width()/2;
		
		this.calendrier_content.css('width', $(window).width()/2);
		this.calendrier_content.css({'top' : top_pos, 'height' : displayed_image.height()});
		this.calendrier_content.find('.viewport').css('height', displayed_image.height() - 10);
		this.calendrier_content.tinyscrollbar({lockscroll: true});
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
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_calendrier(application.currentLocation);
  };

	// I check if everything is ok for the correct display of the view.
	CalendrierView.prototype.check = function(){		
		$('#logo_menu').show('fast');
		
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block") menu_btn.css('display', 'block');
	
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
  // Return a new view class singleton instance.
  return( new CalendrierView() );
  
})( jQuery, window.application ));