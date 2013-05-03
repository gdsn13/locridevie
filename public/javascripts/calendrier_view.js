window.application.addView((function( $, application ){
  
  function CalendrierView(){
		this.model = null;
		this.view = null;
		this.calendrier_spectacles = null;
		this.calendar_line = null;	//template
		this.localize = null;
		this.search_form = null;
		this.month_list_container = null;
  };
  
  CalendrierView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.view = $('#calendrier_container');
		this.localize = application.getModel( "Localize" );
		this.calendrier_spectacles = $('#calendrier_spectacles');
		this.calendar_line = $('#calendar_line');
		this.month_list_container = $('#month_list_for_calendar');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('calendrier_ready', function(){
      self.refreshed_datas();
    });
  };

	CalendrierView.prototype.refreshed_datas = function(){
		var self = this;
		var current_month_for_display = 0;
		var current_date = 0;
		this.calendrier_spectacles.html('');
		this.month_list_container.html('');
		
		var month_list = [];
		
		//AFFICHAGE DES DATES
		$.each(this.model.current_page.dates, function(index, d){

			if (current_date != d.date){
				//AFFICHAGE NOM DU MOIS
				var date = new Date(d.date);
				if (current_month_for_display != date.getMonth()){
					var month = date.getMonth();
					var year = date.getFullYear();
					
					current_month_for_display = month;
					var html = "<li class='month_name' id='month_" + month + "_" + year + "'>" + self.localize.localize_month(date.getMonth());
					html += '<a href="#" class="scroll_to_top"><img src="/images/scroll_top.png"></a></li>';
					self.calendrier_spectacles.append(html);
					month_list.push({"name" : self.localize.localize_month(month), "month" : month, "year" : year});
				}

				d.humanized_date = self.localize.localize_day(date.getDay()) + " " + date.getDate();
			}else{
				d.humanized_date = "";
			}
			
			current_date = d.date;
									
			//CALCUL DES EXTRAS
			var extra = "";
			if (d.tout_public == true) extra += '<img src="/images/tout_public.png" width="15px" align="left"/>';
			if (d.des != "")	extra += '<span class="des">' + d.des + '</span>';
			if (d.temps_scolaire == true) extra += '<img src="/images/temps_scolaire.png" width="15px" align="left"/>';
			if (d.audiodesc == true) extra += '<img src="/images/audiodesc.png" align="left"/>';
			if (d.lds == true) extra += '<img src="/images/signes.png" align="left"/>';
			if (d.plage_age != "") extra += '<span class="tranche">' + d.plage_age + '</span>';

			d.extra = extra
			
			if(d.associe != "false"){
				d.fat_title = "small_title";
			}
			
			//AFFICHAGE DE LA LIGNE DEPUIS TEMPLATE
			self.calendrier_spectacles.append(application.getFromTemplate(self.calendar_line, d));
		});
		
		// AFFICHAGE DES MOIS
		$.each(month_list, function(index, mn){
			var html = '<li><a href="#" class="month_ancor" rel="month_'+ mn.month + '_' + mn.year + '">' + mn.name + '</a></li>';
			self.month_list_container.append(html);
		});
		
		$('.month_ancor').click(function(e){
			e.preventDefault(); 
			e.stopPropagation();
			// id de l'élément ou scroller
			var the_id = $('#' + $(this).attr('rel'));
			$('html, body').animate({  
				scrollTop:$(the_id).offset().top - 20  
			}, 'slow');  
			return false;
		});
		
		$('.scroll_to_top').click(function(e){
			e.preventDefault(); 
			e.stopPropagation();
			$('html, body').animate({  
				scrollTop:0  
			}, 'slow');  
			return false;
		});
		
		// INITIALISATION DU MOTEUR DE RECHERCHE
		this.search_form = this.view.find('form[name=search]');
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
				
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			//Cufon.replace('.des');
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
			});
			
			self.model.set_message_to_growl("");
		});
	};
	
	
	// tout réinitialiser! pour le prochain affichage!!!
	CalendrierView.prototype.hide_view = function(){
		var self = this;
		this.view.fadeOut('fast');
		this.search_form = null;
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
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
  // Return a new view class singleton instance.
  return( new CalendrierView() );
  
})( jQuery, window.application ));