window.application.addView((function( $, application ){
  
  function ArchivesView(){
		this.model = null;
		this.view = null;
		this.spectacle_ul = null;
		this.spectacles = null;
		this.localize = null;
		this.current_month_for_calendar_display = 0;
		this.month_list_container = null;
		this.search_form = null;
		this.current_season = null;
  };
  
  ArchivesView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.view = $('#programmation_container');
		this.spectacle_ul = $('#programmation_spectacles');
		this.month_list_container = $('#month_list');
		
		this.template = $('#spectacle_list_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_ready', function(){
      self.refreshed_datas();
    });
  };

	ArchivesView.prototype.refreshed_datas = function(){
		var self = this;
	
		this.spectacles = this.model.sort_array_by_date(this.model.pages[this.current_season].spectacles);
		
		var month_list = [];
		var changing_month = false;
		
		//AFFICHAGE DE LA LISTE DES SPECTACLES
		$.each(this.spectacles, function(index, s){
									
			var new_month = "";
			var month = new Date(s.date).getMonth();
			var year = new Date(s.date).getFullYear();
			if(self.current_month_for_calendar_display != month){
				changing_month = true;
				self.current_month_for_calendar_display = month;
				month_list.push({"name" : self.localize.localize_month(month), "month" : month, "year" : year});
				var month_line = '<li class="month_name_for_spectacle_list" id="month_' + month + '_' + year + '">';
				month_line += '<a href="javascript:void();">' + self.localize.localize_month(month) + ' ' + year + '</a>';
				month_line += '<a href="#" class="scroll_to_top"><img src="/images/scroll_top.png"></a></li>';
				self.spectacle_ul.append(month_line);
			}
			
			if (changing_month == true){ new_month = "small_padding"; }
			
			var html = '<li class="spectacle_for_spectacle_list ' + new_month + '"><div class="left_content"><img src="' + s.logo_large + '"></div>';
			html += '<div class="spectacle_infos"><h1><a href="/#/spectacle/' + s.slug + '">' + s.titre + '</a></h1>';
			html += '<div class="numero">' + s.numero + '</div>';
			html += '<div class="top_spectacle">';			
			if (s.genre != "" && String(s.genre) != "null") html += '<div class="genre_age">' + s.genre;
			if (s.age != "" && String(s.age) != "null") html += '<span>' + s.age +'</span>';
			if (s.genre != "" && String(s.genre) != "null") html += '</div>';
			html += '<div class="date_infos">' + s.date_infobulles + '</div>';
			html += '<div class="tld">' + s.tld + '</div>';
			html += '<div class="infos_prog">' + s.info_prog + '</div>';
			if (s.resume != "" && String(s.resume) != "null") html += '<div class="resume">' + s.resume + '</div>';
			html += '</div>';
			html += '<div class="spectacle_links"><a href="/#/spectacle/' + s.slug + '">+ En savoir plus</a>';
			html += '</div></li>';
			
			self.spectacle_ul.append(html);
			changing_month = false;
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
		
		Cufon.replace('.numero');
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){			
			self.view.fadeIn('fast', function(){});
			self.model.set_message_to_growl("");
		});
	};
		
	// tout réinitialiser! pour le prochain affichage!!!
	ArchivesView.prototype.hide_view = function(){
		var self = this;
		this.view.fadeOut('fast');
		this.spectacle_ul.html("");
		this.month_list_container.html("");
		this.search_form = null;
	};

  // I get called when the view needs to be shown.
  ArchivesView.prototype.show_view = function( p_parameters ){
		this.view.stop();
    this.check();
		this.current_season = p_parameters.id;
				
		this.model.get_spectacles(this.current_season);
  };

	// I check if everything is ok for the correct display of the view.
	ArchivesView.prototype.check = function(){		
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if (this.localize == null) {
			this.localize = application.getModel( "Localize" );
		}
	};
  // Return a new view class singleton instance.
  return( new ArchivesView() );
  
})( jQuery, window.application ));