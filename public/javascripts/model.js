// Add model to the application.
window.application.addModel((function( $, application ){
	
	
	// les pages sont stockées dans un tableau JSON  de pages.
	// les identifiants des pages sont : noms de la page

	// I am the contacts service class.
	function Model(){
		this.spectacles = [];
		this.pages = [];
		this.current_page = null;
		this.message_to_growl = "";
		this.spectacles_loaded = false;
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
	
	/* PAGES
	----------------------------------------------------------------------------------------*/
	
	Model.prototype.set_current_page = function(p_page_path){
		this.current_page = this.pages[p_page_path];
		$(this).trigger('page_ready');
	};
	
	Model.prototype.set_page = function(p_page){
		this.pages["/" + p_page.fullpath] = p_page;
		this.set_current_page("/" + p_page.fullpath);
		this.set_message_to_growl("");
	};
	
	Model.prototype.get_page = function(p_path){
		if (this.pages[p_path] == null){
			this.set_message_to_growl("Chargement...");
			application.getModel( "LocoService" ).get_page(application.currentLocation);
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

	/* HOME
	----------------------------------------------------------------------------------------*/
	Model.prototype.set_home = function(p_home){
		this.pages["pages/home_page"] = p_home;
		this.current_page = this.pages["pages/home_page"];
		$(this).trigger('home_datas_ready');
	};
	
	Model.prototype.get_home = function(){
		if (this.pages["pages/home_page"] == null){
			this.set_message_to_growl("Chargement...");
			application.getModel( "LocoService" ).get_home();
		}
		else{
			this.current_page = this.pages["pages/home_page"];
			$(this).trigger('home_datas_ready');
		}
	};
	
	/* SPECTACLE
	----------------------------------------------------------------------------------------*/
	Model.prototype.get_spectacle = function(p_title){
		if (this.pages[p_title] == null){
			this.set_message_to_growl("Chargement...");
			application.getModel("LocoService").get_spectacle(p_title);
		}
		else{
			this.current_page = this.pages[p_title];
			$(this).trigger('spectacle_ready');
		}
	};
	
	Model.prototype.set_spectacle = function(p_spectacle){
		this.pages[p_spectacle.slug] = p_spectacle;
		this.current_page = this.pages[p_spectacle.slug];
		$(this).trigger('spectacle_ready');
	};
	
	/* SPECTACLES
	----------------------------------------------------------------------------------------*/
	
	Model.prototype.set_spectacles = function(p_spectacles){
		this.pages[p_spectacles.page.fullpath] = p_spectacles.page;
		this.current_page = this.pages[p_spectacles.page.fullpath];
		$(this).trigger('spectacles_ready');
	};
	
	Model.prototype.get_spectacles = function(p_path){
		if (this.pages[p_path] == null){
			this.set_message_to_growl("Chargement...");
			application.getModel("LocoService").get_spectacles(p_path, this.spectacles_loaded);
		}
		else{
			this.current_page = this.pages[p_path];
			$(this).trigger('spectacles_ready');
		}
	};
	
	Model.prototype.check_for_spectacles = function(){
		if (this.spectacles.length == 0){
			this.spectacles = spectacles_list;
			$(this).trigger('spectacles_list_ready');
		}
	}
	
	Model.prototype.set_calendrier = function(p_dates){
		this.pages["/calendrier"] = p_dates;
		this.current_page = this.pages["/calendrier"];
		$(this).trigger('calendrier_ready');
	}
	
	Model.prototype.get_calendrier = function(){
		if (this.pages["/calendrier"] == null){
			this.set_message_to_growl("Chargement...");
			application.getModel("LocoService").get_calendrier();
		}
		else{
			this.current_page = this.pages["/calendrier"];
			$(this).trigger('calendrier_ready');
		}
	}
		
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
	
	/* I order spectacles list by date of representation 			
	----------------------------------------------------------------------------------------*/
	Model.prototype.spectacles_ordered_by_date = function(){
		var spec = this.spectacles;
		spec.sort(this.sort_by('date', true, function(a){return new Date(a)}));
		return spec;
	};
	
	Model.prototype.init = function(){
		
	};
	
	Model.prototype.call_menu_displaying = function(){
		$(this).trigger('menu_is_displaying');
	};
	
	Model.prototype.call_menu_hiding = function(){
		$(this).trigger('menu_is_hidding');
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