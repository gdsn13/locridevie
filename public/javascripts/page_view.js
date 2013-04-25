window.application.addView((function( $, application ){
  
	/*
	/		Affiche une page statique.
	/		
	/		
	/
	/		{
					"fullpath":"espaces-dedies/la-criee-vous-ecoute",
					"body":"<p><span ",
					"jules":[
						{
							"name":"full intro",
							"block":"<h1>Bienvenus</h1>",
							"picto":"/contents/jules/4fb24da8fc70f501f2000002/MM_photo004.jpg",
							"url":""
						},{
							"name":"programmation uno",
							"block":"<h1>Programmation,</h1>\r\n<p>message pour la programmation</p>",
							"picto":"/contents/jules/4fb25245fc70f501f2000021/MMtitanic006.jpg",
							"url":""
						},
					"boutons":[],
					"actus":[],
					"picto":null
			}
	/
	/
	----------------------------------------------*/


  function PageView(){
		this.model = null;
		this.view = null;
		this.content_view = null;
		this.jules_container = null;
		this.button_container = null;
		this.content_container = null;
		this.jules = [];
		this.currently_displayed_jules = null;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.current_index = 0;
		this.left_content = null;
		this.search_form = null;
  };
  
  PageView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.jules_container = $('#images_slider');
		this.model = application.getModel( "Model" );
		this.content_view = $('#contents');
		this.view = $('#pages');
		this.content_container = $('#content_static_container');
		this.left_content = $('#left_content_pages');
		this.buttons_container = $('#left_page_buttons');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on( 'page_ready', function(){
			self.data_ready();
    });
  };

	PageView.prototype.data_ready = function(){
		var self = this;
				
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){						
			var html = '<div class="image" id="jules_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#jules_' + index);
			self.jules.push(this_container);
			if (index == 0) self.currently_displayed_jules = this_container.find('img').first();
			else this_container.css('display', 'none');
		});
		
		//AFFICHAGE DES BOUTONS
		$.each(this.model.current_page.boutons, function(index, b){
			var html = '<div id="button_' + index +'"><h2>' + b.title + '</h2>';
			html += b.block + '</div>';
			self.buttons_container.append(html);
		});
		
		//REMPLISSAGE DU BODY
		this.content_container.html(this.model.current_page.body);
		
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
		
		this.view.imagesLoaded(function(){				
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
				if (self.jules.length >1){
					self.slider_timeout = setTimeout(function(){
						self.animate();
						}, self.slider_duration);
				}
			});

			self.model.set_message_to_growl("");			// on cache le loader
		});
	};
	
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	PageView.prototype.animate = function(){
		var saved_index = this.current_index;
		var self = this;
		
		this.current_index == this.jules.length - 1 ? this.current_index = 0 : ++this.current_index;
		
		this.jules[saved_index].fadeOut( 1000 );
		this.jules[this.current_index].fadeIn( 1000 );
		this.currently_displayed_jules = this.jules[this.current_index].find('img').first(); 

		this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
			self.animate();
			}, this.slider_duration);
	};
	
	
	PageView.prototype.hide_view = function(next_view_is_page){
		var self = this;
		clearTimeout(this.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast', function(){});
		this.view.css('display', 'none');
		$( window ).unbind();
		this.jules_container.html("");
		this.content_container.html("");
		this.jules = [];
		this.current_index = 0;
		this.search_form = null;
	};
	
	PageView.prototype.show_view = function(){
		this.view.stop();
		this.check();
		this.model.get_page(application.currentLocation.slice(application.currentLocation.indexOf("/"), application.currentLocation.length));
	};
	
	// I check if everything is ok for the correct display of the view.
	PageView.prototype.check = function(){
		//check que le slider soit bien affiché		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
  
  // Return a new view class singleton instance.
  return( new PageView() );
  
})( jQuery, window.application ));