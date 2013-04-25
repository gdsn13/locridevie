window.application.addView((function( $, application ){
  
  function SearchView(){
		this.model = null;
		this.view = null;
		this.search_content = null;
		this.jules_container = null;
		this.search_results = null;
		this.spectacles = null;
		this.localize = null;
		this.jules = [];
		this.current_index = 0;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.currently_displayed_jules = null;
		this.search_form = null;
		this.from_page = false;
		this.form_bottom_page = null;
  };
  
  SearchView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.view = $('#search_container');
		this.search_content = $('#search_content');
		this.jules_container = $('#search_sliders');
		this.search_results = $('#search_results');
		
		this.template = $('#spectacle_list_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('search_results_ready', function(){
      self.refreshed_datas();
    });

		//AFFICHAGE DU FORMULAIRE DE RECHERCHE
		this.form_bottom_page = $('form[name=search]');
		this.form_bottom_page.submit(function(e){
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

	SearchView.prototype.refreshed_datas = function(){
		
		
		
		var self = this;
		
		self.search_results.html("");

		if (this.from_page == false){
			//AFFICHAGE DES JULES
			$.each(this.model.current_page, function(index, j){
				var html = '<div class="jules_slider" id="image_' + index +'"><img src="' + j.picto + '"/></div>';
				self.jules_container.append(html);
				var this_container = $('#image_' + index);
				self.jules.push(this_container);
				if (index == 0) self.currently_displayed_jules = this_container.find('img').first();
				else this_container.css('display', 'none');
			});
		}
		
		//AFFICHAGE DE LA LISTE DES RESULTAT
	
	  // si il y a une query_string
		if (this.model.pages["query_string"] != undefined){
			var liste_title = "<li class='opening'><span class='fat'>Résultat pour la recherche : </span>" + this.model.pages["query_string"] + "</li>";
			self.search_results.append(liste_title);
		}
		else {	// si deirectement page recherche (pas de query_string)
			var liste_title = "<li class='opening'><span class='fat'>Nouvelle recherche</span></li>";
			self.search_results.append(liste_title);
		}
		//empty results
		if (this.model.search_result.pages.length == 0 && this.model.search_result.spectacles.length == 0){
			if (this.model.pages["query_string"] != undefined){
				var html = '<li>Il n\'y a aucun résultat correspondant à votre recherche</li>';
				self.search_results.append(html);
			}
		}
		
		//formulaire de recherche bis bis
		var form = '<li><form class="search_form_page" action="#" name="re_search"><input type="text" size="20" name="query_string" required tabindex="1" ><input type="submit" class="submit_btn" value="Rechercher"/></form></li>';
		self.search_results.append(form);
		if (self.search_form != null)	self.search_form.unbind();
		self.search_form = $('form[name=re_search]');
		self.search_form.submit(function(e){
			e.stopPropagation();
    	e.preventDefault();
			self.model.query_string = self.search_form.serializeArray();
			self.model.get_search_results();
			self.from_page = true;
		});

		// affichage des resutlats (pages)
		$.each(this.model.search_result.pages, function(index, p){
			var html = '<li><a href="/#/pages/' + p.fullpath + '">' + p	.titre + '</a></li>';
			self.search_results.append(html);
		});

		//affichage des résultats (spectacles)
		$.each(this.model.search_result.spectacles, function(index, s){
			if (s.spectacle_associe_path == ""){
				var html = '<li><div class="spectacle_list_numero">' + s.numero + '</div><div class="spectacle_list_title"><a href="/#/spectacle/' + s.slug + '">' + s.titre + '</a></div></li>';
				self.search_results.append(html);
			}
			else{
				var html = '<li><div class="spectacle_list_numero">' + s.numero + '</div><div class="spectacle_list_title"><a href="/#/spectacle/' + s.spectacle_associe_path + '">' + s.titre + '</a></div></li>';
				self.search_results.append(html);
			}
		});
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			
			// ON AFFICHE LA VUE
			if (self.from_page == false){
					self.view.fadeIn('fast', function(){
					// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
					if (self.jules.length > 0 ){ 
						self.slider_timeout = setTimeout(function(){
							self.animate();
							}, self.slider_duration);	
						}
					});
			}
			
			Cufon.replace('.spectacle_list_numero');
			
			self.model.set_message_to_growl("");
			
		});
	};
	
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	SearchView.prototype.animate = function( ){
		var saved_index = this.current_index;
		var self = this;
		
		this.current_index == this.jules.length - 1 ? this.current_index = 0 : ++this.current_index;
		
		if (this.jules[saved_index] != null){
		
			this.jules[saved_index].fadeOut( 'fast' );
			this.jules[this.current_index].fadeIn( 'fast' );
			this.currently_displayed_jules = this.jules[this.current_index].find('img').first(); 

			this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
				self.animate();
				}, this.slider_duration);
		}
	};
	
	// tout réinitialiser! pour le prochain affichage!!!
	SearchView.prototype.hide_view = function(){
		var self = this;
		clearTimeout(this.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast');
		this.jules = [];
		this.current_index = 0;
		this.jules_container.html("");
		this.search_results.html("");
		self.from_page = false;
	};

  // I get called when the view needs to be shown.
  SearchView.prototype.show_view = function( p_parameters ){
		this.view.stop();
    this.check();
		this.model.get_search_results();
  };

	// I check if everything is ok for the correct display of the view.
	SearchView.prototype.check = function(){				
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
  // Return a new view class singleton instance.
  return( new SearchView() );
  
})( jQuery, window.application ));