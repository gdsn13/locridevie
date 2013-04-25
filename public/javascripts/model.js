// Add model to the application.
window.application.addModel((function( $, application ){
	
	
	// les pages sont stockées dans un tableau JSON de pages.
	// les identifiants des pages sont : noms de la page
	// toutes les données sont stockées dans le page.json == la base de donnée
	
	// this.current_request_number :
	// le lancement des requette porte un numéro de requette. Si une autre requette est lancée avant que la requette
	// soit exécutée, le resultat de la premiére requette sera mis en mémoire, mais ne sera pas affichée. Sinon, avec le hide et show
	// on se retrouve avec deux vues en même temps!

	// I am the contacts service class.
	function Model(){
		this.spectacles = [];
		this.pages = [];
		this.current_page = null;
		this.message_to_growl = "";
		this.current_request_number = 0;
		this.home_page_is_displayed = false;
		this.current_user = "";
		this.query_string = "";
	};
	
	Model.prototype.hide_finished = function(){
		$(this).trigger('hide_finished');
	}
	
	/* GROWL MESSAGE
	----------------------------------------------------------------------------------------*/	
	
	Model.prototype.set_message_to_growl = function(p_message){
		p_message == "" ? this.message_to_growl = "" : this.message_to_growl = "<p>" + p_message + "</p>";
		$(this).trigger('messaging');
	};
	
	/* SEARCH
	----------------------------------------------------------------------------------------*/
	
	Model.prototype.get_search_results = function(){
		this.set_message_to_growl("Recherche...");
		this.current_request_number += 1;
		application.getModel( "LocoService" ).get_search(this.query_string, this.current_request_number);
	};
	
	Model.prototype.set_search = function(p_search_list, p_request_number){
		if (this.current_request_number == p_request_number){
			this.pages["recherche"] = p_search_list.jules;
			this.pages["query_string"] = p_search_list.query;
			this.current_page = this.pages["recherche"];
			this.search_result = p_search_list;
			$(this).trigger('search_results_ready');
		}
	};
	
	/* PAGES
	----------------------------------------------------------------------------------------*/
	Model.prototype.set_current_page = function(p_page_path){
		this.current_page = this.pages[p_page_path];
		$(this).trigger('page_ready');
	};
	
	Model.prototype.set_page = function(p_page, p_request_number){
		// on stocke le resultat de la requette
		this.pages["/" + p_page.fullpath] = p_page;
		// si une autre requette n'a pas été lancée entre temps, on lance l'affichage
		if (this.current_request_number == p_request_number){
			this.set_current_page("/" + p_page.fullpath);
			this.set_message_to_growl("");
		}
	};
	
	Model.prototype.get_page = function(p_path){
		if (this.pages[p_path] == null){
			this.set_message_to_growl("Chargement...");
			this.current_request_number += 1;
			application.getModel( "LocoService" ).get_page(application.currentLocation, this.current_request_number);
		}
		else{
			this.set_current_page(p_path);
		}
	};

	/* INTRO
	----------------------------------------------------------------------------------------*/

	Model.prototype.set_intro = function(p_intro){
		this.pages["intro"] = p_intro;
		this.current_page = this.pages["intro"];
		this.set_message_to_growl("");
		$(this).trigger('intro_ready');
	};
	
	/* ESPACE_PRO
	----------------------------------------------------------------------------------------*/
	Model.prototype.get_user_and_data = function(p_datas){
		//Dans tous les cas, on va chercher sur le serveur pour savoir si l'utilisateur est la ou non!
		this.set_message_to_growl("Connexion...");
		this.current_request_number += 1;
		application.getModel("LocoService").get_pro(p_datas, this.current_request_number);
	};
	
	Model.prototype.get_pro_page = function(){
		if (this.pages["pro"] == null){
			this.set_message_to_growl("Chargement...");
			this.current_request_number += 1;
			application.getModel("LocoService").get_pro_page(this.current_request_number);
		}else{
			this.current_page = this.pages["pro"];
			$(this).trigger('spacepro_ready');
		}
	};
	
	Model.prototype.set_pro_datas = function(p_datas, p_request_number){
		this.pages["pro_datas"] = p_datas;
		if (this.current_request_number == p_request_number){
			$(this).trigger('spacepro_data_ready');
		}
	}
	
	Model.prototype.set_pro_page = function(p_pro, p_request_number){
		// on stocke le resultat de la requette
		this.pages["pro"] = p_pro;
		// si une autre requette n'a pas été lancée entre temps, on lance l'affichage
		if (this.current_request_number == p_request_number){
			this.current_page = this.pages["pro"];
			$(this).trigger('spacepro_ready');
		}
	};
	
	/* SPECTACLE
	----------------------------------------------------------------------------------------*/
	Model.prototype.get_spectacle = function(p_title){
		if (this.pages[p_title] == null){
			this.set_message_to_growl("Chargement...");
			this.current_request_number += 1;
			application.getModel("LocoService").get_spectacle(p_title, this.current_request_number);
		}
		else{
			this.current_page = this.pages[p_title];
			$(this).trigger('spectacle_ready');
		}
	};
	
	Model.prototype.set_spectacle = function(p_spectacle, p_request_number){
		// on stocke le resultat de la requette
		this.pages[p_spectacle.slug] = p_spectacle;
		// si une autre requette n'a pas été lancée entre temps, on lance l'affichage
		if (this.current_request_number == p_request_number){
			this.current_page = this.pages[p_spectacle.slug];
			$(this).trigger('spectacle_ready');
		}
	};
	
	/* NEWSLETTERS
	----------------------------------------------------------------------------------------*/
	Model.prototype.get_newsletters = function(){
		if (this.pages["newsletters"] == null){
			this.set_message_to_growl("Chargement... ");
			this.current_request_number += 1;
			application.getModel("LocoService").get_newsletters(this.current_request_number);
		}
		else{
			this.current_page = this.pages["newsletters"];
			$(this).trigger('newsletters_ready');
		}
	};
	
	Model.prototype.set_newsletters = function(p_newsletters, p_request_number){
		// on stocke le resultat de la requette
		this.pages["newsletter"] = p_newsletters;
		// si une autre requette n'a pas été lancée entre temps, on lance l'affichage
		if (this.current_request_number == p_request_number){
			this.current_page = this.pages["newsletter"];
			$(this).trigger('newsletters_ready');
		}
	};
	
	/* SPECTACLES
	----------------------------------------------------------------------------------------*/
	
	Model.prototype.check_for_spectacles = function(){
		if (this.spectacles.length == 0){
			this.spectacles = spectacles_list;
			$(this).trigger('spectacles_list_ready');
		}
	}
	
	Model.prototype.set_calendrier = function(p_dates, p_request_number){
		// on stocke le resultat de la requette
		this.pages["/calendrier"] = p_dates;
		// si une autre requette n'a pas été lancée entre temps, on lance l'affichage
		if (this.current_request_number == p_request_number){
			this.current_page = this.pages["/calendrier"];
			$(this).trigger('calendrier_ready');
		}
	}
	
	Model.prototype.get_calendrier = function(){
		if (this.pages["/calendrier"] == null){
			this.set_message_to_growl("Chargement...");
			this.current_request_number += 1;
			application.getModel("LocoService").get_calendrier(this.current_request_number);
		}
		else{
			this.current_page = this.pages["/calendrier"];
			$(this).trigger('calendrier_ready');
		}
	}
	
	/* ORDERING FUNCTIONS
	----------------------------------------------------------------------------------------*/
		
	/* I return only spectacles with en_tournee == true, ordered by title 	
	----------------------------------------------------------------------------------------*/
	Model.prototype.spectacles_en_tournee = function(){
		var spec = [];
		$.each(this.spectacles, function(index, value){
			if (value.en_tournee == true || value.en_tournee == 'true'){
				spec.push(value);
			}
		});
		// order by alphabetic order
		spec.sort(this.sort_by('titre', true, function(a){return a.toUpperCase()}));
		return spec;
	};
	
	Model.prototype.spectacles_ordered_by_numero = function(){
		var spec = this.spectacles;
		spec.sort(this.sort_by('numero', true, function(a){return a.toUpperCase()}));
		return spec;
	};
	
	Model.prototype.spectacles_ordered_by_date = function(){
		var spec = this.spectacles;
		spec.sort(this.sort_by('date', true, function(a){return new Date(a)}));
		return spec;
	};
	
	Model.prototype.init = function(){
		
	};
	
	/* INTER VIEW EVENTS
	----------------------------------------------------------------------------------------*/	
	
	Model.prototype.call_menu_displaying = function(){
		$(this).trigger('menu_is_displaying');
	};
	
	Model.prototype.call_menu_hiding = function(){
		$(this).trigger('menu_is_hidding');
	};
	
	Model.prototype.hide_menu_command = function(){
		$(this).trigger('hide_menu');
	};
		
	/* FUNCTIONS TOOL
	----------------------------------------------------------------------------------------*/	
	Model.prototype.sort_by_date = function(a, b){
		var data = new Date(a.date);
		var datb = new Date(b.date);
		
		return data.getTime() - datb.getTime();
	}
			
	Model.prototype.sort_by = function(field, reverse, primer){

	   var key = function (x) {return primer ? primer(x[field]) : x[field]};

	   return function (a,b) {
	       var A = key(a), B = key(b);
	       return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
	   }
	}
	
	// Return a new model class singleton instance.
	return( new Model() );
	
})( jQuery, window.application ));