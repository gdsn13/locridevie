window.application.addView((function( $, application ){
	
	
	/*
	/		TRICKS : le sliders des images joue sur l'opacité DU CONTENEUR puisque si display = none, on a plus accés aux informations de l'image (height et width)
	/   
	/		
	/		Affiche un spéctacle.
	/
	/		{
	/			"slug":"spectacle-1",
	/			"tld":"<p>tarif C</p>\r\n<p>dure\u0301e 3h30 avec entracte</p>\r\n<p>Grand The\u0301a\u0302tre</p>\r\n<p>Mar-Sam 19h Dim 15h du 5 au 11 janvier</p>",
	/			"title":"Spectacle 1",
	/			"logo":"/contents/content_instance/4fb25eb5fc70f501f20000fa/3.jpg",
	/			"date":"2012-01-01",
	/			"images":[
	/				{"thumb":"/contents/content_instance/4fb25f0afc70f501f20000ff/thumb_MM_photo003.jpg","image":"/contents/content_instance/4fb25f0afc70f501f20000ff/MM_photo003.jpg"},
	/				{"thumb":"/contents/content_instance/4fb25f0dfc70f501f2000102/thumb_MM_photo004.jpg","image":"/contents/content_instance/4fb25f0dfc70f501f2000102/MM_photo004.jpg"}
	/			],
	/			"presentation":"<p>Mise en sce\u0300ne de DenisPodalyde\u0300s Guerrier, Yvan Garcia et Olivier Fortin clavecin (en alternance)</p>",
	/			"numero":"24"
	/		}
	/
	/
	----------------------------------------------*/
  
  function SpectacleView(){
		this.model = null;
		this.view = null;
		this.current_spectacle = null;
		this.template = null;
		this.images_container = null;
		this.spectacle_content = null;
		this.slider_timeout = null;
		this.current_index = 0;
		this.images = [];
		this.slider_duration = 5000;
		this.currently_displayed_image = null
		this.next_show = null;
		this.prev_show = null;
		this.next_caption = null;
		this.prev_caption = null;
		this.left_spectacle = null;
		this.search_form = null;
  };
  
  SpectacleView.prototype.init = function(){  
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.view = $('#spectacle_container');
		this.template = $('#spectacle_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacle_ready', function(){
      self.display_view();
    });
		
  };

	SpectacleView.prototype.display_view = function(){
		//INITIALISATION
		var self = this;

		// RECUPERATION DU TEMPLATE ET REMPLISSAGE
		this.view.html(application.getFromTemplate(this.template, this.model.pages[this.current_spectacle]));
		
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
		
		// INITIALISATION DU LIEN DE RESERVATION
		var resa = $('#lien_reservation_spectacle');
		if (self.model.pages[self.current_spectacle].resa != ""){
			resa.find('a').attr('href', self.model.pages[self.current_spectacle].resa);
			$('#reservation_block').css('display', 'block');
		}
		else
			$('#reservation_block').css('display', 'none');
		
		// INIT AGE
		if (self.model.pages[self.current_spectacle].age != ""){
			$('#age_spectacle').css('display', 'none');
		}else{
			$('#age_spectacle').css('display', 'block');
		}
		
		// AUTOUR
		if (self.model.pages[self.current_spectacle].autour == ""){
			$('#autour').css('display', 'none');
		}
		
		// EN SAVOIR PLUS
		if (self.model.pages[self.current_spectacle].plus == ""){
			$('#plus').css('display', 'none');
		}
		
		// YOUTUBE
		if (self.model.pages[self.current_spectacle].video == ""){
			$('#video_youtube').css('display', 'none');
		}
		
		// INITALISATION DES CONTAINERS 
		this.images_container = $('#images_spectacle');
		this.spectacle_content = $('#spectacle_content');
		var image_template = $('#image_galery_for_spectacle');
		this.next_show = $('#next_show');
		this.prev_show = $('#prev_show');
		this.next_caption = $('#next_show_caption');
		this.prev_caption = $('#prev_show_caption');
		this.left_spectacle = $("#left_spectacle");
		
		// GENERATION DES IMAGES
		$.each(this.model.pages[this.current_spectacle].images, function(index, img){
			img.index = index; //index sert à alimenter le template!
			self.images_container.append(application.getFromTemplate(image_template, img));
			var current = self.images_container.find('#image_'+index);
			self.images.push(current);
			//on affiche la premiere puis, on masque les autres
			if (index == 0) self.currently_displayed_image = current.find('img').first();
			else current.css('display', 'none');
		});

						
		//TOUT EST CHARGÉ
		this.view.imagesLoaded(function(){
			Cufon.replace('div.numero');
			
			// NAVIGATION INTER - SPECTACLES (NEXT + PREV)
			// CREATION DES CAPTIONS
			
			var only_sp = []; //ne contient que les spectacle, et pas les spectacle avec sp associés
			var ci = 0; //index dans les vrais sepctacles
			
			$.each(self.model.spectacles_ordered_by_numero(), function(index, s){
				if (s.spectacle_associe_path == ""){
					only_sp.push(s);
				}
			});
			
			$.each(only_sp, function(index, sp){
				if (sp.slug == self.current_spectacle){
					ci = index;
				}
			});
			
			//PREV LINK
			if (ci > 0){	
				self.prev_show.attr('href', '/#/spectacle/' + only_sp[ci - 1].slug);
				$('#prev_show_genre').html(only_sp[ci - 1].genre);
				$('#prev_show_title').html(only_sp[ci - 1].titre);
				$('#prev_show_number').html(only_sp[ci - 1].numero);
				$('#prev_show_infos').html('<div class="date_infos">' + only_sp[ci - 1].date_infobulles + "</div>" + only_sp[ci - 1].infobulle);
				Cufon.replace('div#prev_show_number');
			}else{
				self.prev_show.css('display', 'none');
			}
			
			//NEXT LINK
			if (ci < only_sp.length - 2){ //commence à 0 et le dernier
				self.next_show.attr('href', '/#/spectacle/' + only_sp[ci + 1].slug);
				$('#next_show_genre').html(only_sp[ci + 1].genre);
				$('#next_show_title').html(only_sp[ci + 1].titre);
				$('#next_show_number').html(only_sp[ci + 1].numero);
				$('#next_show_infos').html('<div class="date_infos">' + only_sp[ci + 1].date_infobulles + "</div>" + only_sp[ci + 1].infobulle);
				Cufon.replace('div#next_show_number');
			}else{
				self.next_show.css('display', 'none');
			}
			
			self.prev_show.hover(function(){
				self.prev_caption.stop().fadeIn('fast');
			}, function(){
				self.prev_caption.stop().fadeOut('fast');
			});
			
			self.next_show.hover(function(){
				self.next_caption.stop().fadeIn('fast');
			}, function(){
				self.next_caption.stop().fadeOut('fast');
			});
			
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
				if (self.images.length > 1){
					self.slider_timeout = setTimeout(function(){
						self.animate();
					}, self.slider_duration);	
				}
			});
			self.model.set_message_to_growl("");
		});
	};
	
	SpectacleView.prototype.animate = function( ){
		var saved_index = this.current_index;
		var self = this;

		this.current_index == this.images.length - 1 ? this.current_index = 0 : ++this.current_index;
		
		this.images[saved_index].fadeOut(1500);
		this.images[this.current_index].fadeIn(1500);
		this.currently_displayed_image = this.images[this.current_index].find('img').first(); 
		
		this.slider_timeout = setTimeout(function(){
			self.animate();
		}, this.slider_duration);
	};
		

	// Je cache la vue
	SpectacleView.prototype.hide_view = function(){
		clearTimeout(this.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast');
		this.current_index = 0;
		this.left_spectacle = null;
		this.images_container = null;
		this.view.html("");
		this.currently_displayed_image = null;
		this.images = [];
		this.next_show = null;
		this.prev_show = null;
		this.next_caption = null;
		this.prev_caption = null;
		this.search_form = null;
	};

  // I get called when the view needs to be shown.
  SpectacleView.prototype.show_view = function( p_parameters ){
		var self = this;
		this.view.stop();
    this.check();
		this.current_spectacle = p_parameters.id;

		this.model.get_spectacle(this.current_spectacle);
  };
  
	// I check if everything is ok for the correct display of the view.
	SpectacleView.prototype.check = function(){			
		this.images_container = null;
		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
	
  // Return a new view class singleton instance.
  return( new SpectacleView() );
  
})( jQuery, window.application ));