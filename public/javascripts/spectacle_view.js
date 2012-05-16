window.application.addView((function( $, application ){
	
	
	/*
	/		TRICKS : le sliders des images joue sur l'opacité DU CONTENEUR puisque si display = none, on a plus accés aux informations de l'image (height et width)
	/		
	/		Affiche un spéctacle. en mode holywood : slider d'image à droite, scroller de texte à gauche. en 50/50 de largeur
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
		this.close_button = null;
		this.spectacle_content = null;
		this.slider_timeout = null;
		this.current_index = null;
		this.images = [];
		this.slider_duration = 5000;
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
		this.current_index = 0;
		this.images_container = null;
		this.view.html("");
		
		// RECUPERATION DU TEMPLATE ET REMPLISSAGE
		this.view.html(application.getFromTemplate(this.template, this.model.pages[this.current_spectacle]));

		// INITALISATION DES CONTAINERS 
		this.images_container = $('#images_spectacle');
		this.spectacle_content = $('#spectacle_content');
		var image_template = $('#image_galery_for_spectacle');
		
		//INITIALISATION DES TAILLES DES CONTAINERS
		this.images_container.css({'width': $(window).width()/2, 'height' : "100%"});
		this.spectacle_content.css('width', $(window).width()/2);
		
		// GENERATION DES IMAGES
		$.each(this.model.pages[this.current_spectacle].images, function(index, img){
			img.index = index;
			self.images_container.append(application.getFromTemplate(image_template, img));
			var current = self.images_container.find('#image_'+index);
			self.images.push(current);
			if (index > 0){
				current.css('opacity', 0);
			}
		});
		
		// RESIZE DES IMAGES UNE FOIS QU'ELLES SONT CHARGEES
		this.images_container.find('img').load(function(){
			var img = this;
			//$(this).css('opacity', 0);
			self.resize($(this).parent(), $(this));
			// SUIVRE LE RESIZE DE WINDOWS
			$(window).on('resize', function(){
				self.resize($(img).parent(), $(img));
			});
		});
				
		this.view.imagesLoaded(function(){
			$(window).on('resize', function(){
				self.resize_containers();
			});
			
			
			
			//INIT DES POS DES CONTAINERS
			self.resize_containers();
			
			//INIT DE LA ZONE DE SCROLL
			self.spectacle_content.tinyscrollbar({lockscroll: true});
			
			// ON AFFICHE LA VUE
			self.view.animate({opacity:1},'fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
				self.slider_timeout = setTimeout(function(){
					self.animate("next");
				}, self.slider_duration);
				
			});
			self.model.set_message_to_growl("");
		});
	};
	
	SpectacleView.prototype.animate = function( p_way ){
		var saved_index = this.current_index;
		var self = this;
		
		switch( p_way ){
			case "next":
				this.current_index == this.images.length - 1 ? this.current_index = 0 : ++this.current_index;
				break;
			case "prev":
				this.current_index == 0 ? this.current_index = this.images.length - 1 : --this.current_index;
				break;
		}

		this.images[saved_index].animate({opacity:0}, 'fast');
		this.images[this.current_index].animate({opacity:1}, 'fast');
		
		this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
			self.animate("next");
		}, this.slider_duration);
	};
	
	//je resize la photo
	SpectacleView.prototype.resize = function(p_container, p_img) {				
		p_img.width($(window).width()/2);
		var top_pos = ($(window).height() - p_img.height())/2;
		p_container.css('top', top_pos);
	};
	
	SpectacleView.prototype.resize_containers = function(){
		var first_image = this.images_container.find('img').first();
		var top_pos = ($(window).height() - first_image.height())/2;
		
		this.images_container.css({'width': $(window).width()/2, 'height':$(window).height()});
		this.spectacle_content.css('width', $(window).width()/2);
		this.spectacle_content.css({'top' : top_pos, 'height' : first_image.height()});
		this.spectacle_content.find('.viewport').css('height', first_image.height() - 10);
		this.spectacle_content.tinyscrollbar({lockscroll: true});
	};

	// Je cache la vue
	SpectacleView.prototype.hide_view = function(){
		clearTimeout(this.slider_timeout);
		this.slider_timeout = null;
		$(window).unbind();
		this.view.animate({opacity : 0}, 'fast');
	};

  // I get called when the view needs to be shown.
  SpectacleView.prototype.show_view = function( p_parameters ){
    this.check();
		this.current_spectacle = p_parameters.id;

		this.model.get_spectacle(this.current_spectacle);
  };
  
	// I check if everything is ok for the correct display of the view.
	SpectacleView.prototype.check = function(){
		
		var left = $('#logo_menu');
	
		this.images_container = null;
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast');
		
		$('body').css({'overflow-y': 'auto'});
		this.view.css({'display' : 'block', 'opacity' : '0'});
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(left.css('display') == 'none'){
			left.show('fast');
		}
	};
	
  // Return a new view class singleton instance.
  return( new SpectacleView() );
  
})( jQuery, window.application ));