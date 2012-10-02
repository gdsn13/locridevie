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
		this.current_index = 0;
		this.images = [];
		this.slider_duration = 5000;
		this.currently_displayed_image = null
		this.spectacle_index = null;
		this.next_show = null;
		this.prev_show = null;
		this.next_caption = null;
		this.prev_caption = null;
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
		this.view.css({'top':"10000px", "display" : "block", "position" : "absolute"});
		
		// RECUPERATION DU TEMPLATE ET REMPLISSAGE
		this.view.html(application.getFromTemplate(this.template, this.model.pages[this.current_spectacle]));

		// INITALISATION DES CONTAINERS 
		this.images_container = $('#images_spectacle');
		this.spectacle_content = $('#spectacle_content');
		var image_template = $('#image_galery_for_spectacle');
		this.next_show = $('#next_show');
		this.prev_show = $('#prev_show');
		this.next_caption = $('#next_show_caption');
		this.prev_caption = $('#prev_show_caption');
		
		// GENERATION DES IMAGES
		$.each(this.model.pages[this.current_spectacle].images, function(index, img){
			img.index = index; //index sert à alimenter le template!
			self.images_container.append(application.getFromTemplate(image_template, img));
			var current = self.images_container.find('#image_'+index);
			self.images.push(current);
			if (index == 0) self.currently_displayed_image = current.find('img').first();
			else current.css('display', 'none');
		});
						
		//TOUT EST CHARGÉ
		this.view.imagesLoaded(function(){
			//RESIZING
			$(window).on('resize', function(){	self.resize_containers();	});
			
			Cufon.replace('div.numero');
			
			//INIT DES POS DES CONTAINERS
			self.resize_containers();
						
			if (Modernizr.mq('(max-width: 640px)') == true){
				self.view.css({'top':"0px", "display" : "none", "position" : "static"});	
			}else{
				self.view.css({'top':"0px", "display" : "none"});	
			}
			
			// NAVIGATION INTER - SPECTACLES (NEXT + PREV)
			// CREATION DES CAPTIONS
			if (self.spectacle_index > 0){
				self.prev_show.attr('href', '/#/spectacle/' + self.model.spectacles[self.spectacle_index - 1].slug);
				$('#prev_show_title').html(self.model.spectacles[self.spectacle_index - 1].titre);
				$('#prev_show_number').html(self.model.spectacles[self.spectacle_index - 1].numero);
				$('#prev_show_infos').html(self.model.spectacles[self.spectacle_index - 1].date_infobulles + "<br/>" + self.model.spectacles[self.spectacle_index - 1].infobulle);
				Cufon.replace('div#prev_show_number');
			}else{
				self.prev_show.css('display', 'none');
			}
			if (self.spectacle_index < self.model.spectacles.length - 2){
				self.next_show.attr('href', '/#/spectacle/' + self.model.spectacles[self.spectacle_index + 1].slug);
				$('#next_show_title').html(self.model.spectacles[self.spectacle_index + 1].titre);
				$('#next_show_number').html(self.model.spectacles[self.spectacle_index + 1].numero);
				$('#next_show_infos').html(self.model.spectacles[self.spectacle_index + 1].date_infobulles + "<br/>" + self.model.spectacles[self.spectacle_index + 1].infobulle);
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
				self.slider_timeout = setTimeout(function(){
					self.animate();
				}, self.slider_duration);	
			});
			self.model.set_message_to_growl("");
		});
	};
	
	SpectacleView.prototype.animate = function( ){
		var saved_index = this.current_index;
		var self = this;

		this.current_index == this.images.length - 1 ? this.current_index = 0 : ++this.current_index;
		
		this.images[saved_index].fadeOut('fast');
		this.images[this.current_index].fadeIn('fast');
		this.currently_displayed_image = this.images[this.current_index].find('img').first(); 
		
		this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
			self.animate();
		}, this.slider_duration);
	};
		
	SpectacleView.prototype.resize_containers = function(){
		var displayed_image = this.currently_displayed_image;
		
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.images_container.find('.image img').width($(window).width());

			this.images_container.css({	'width': $(window).width(), 
																	'height': displayed_image.height(),
																	'position': 'absolute',
																	'top': '100px',
																	'left': '0'});

			$(".scrollbar").css('display', 'none');
			$(".viewport").css('height', $('#presentation').height() + 130);
			this.view.css('height', displayed_image.height() + $('.viewport').height() + 100);

			this.spectacle_content.css({'width': $(window).width(),
																			'top': (displayed_image.height() + 100) + "px",
																			'left': '0',
																			'height': $('#presentation').height() + 130
																			});
		}else{
			var top_pos;
		
			this.images_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.images_container.find('.image img').width($(window).width()/2);
		
			top_pos = ($(window).height() - displayed_image.height())/2;
		
			this.images_container.find('.image').css('top', top_pos);
		
			this.spectacle_content.css('width', $(window).width()/2);
			this.spectacle_content.css({'top' : top_pos, 'height' : displayed_image.height()});
			this.spectacle_content.find('.viewport').css('height', displayed_image.height() - 10);
			this.spectacle_content.tinyscrollbar({lockscroll: true});
		}
	};

	// Je cache la vue
	SpectacleView.prototype.hide_view = function(){
		clearTimeout(this.slider_timeout);
		this.slider_timeout = null;
		$(window).unbind();
		this.view.fadeOut('fast');
		this.current_index = 0;
		this.images_container = null;
		this.view.html("");
		this.currently_displayed_image = null;
		this.images = [];
		this.next_show = null;
		this.prev_show = null;
		this.next_caption = null;
		this.prev_caption = null;
	};

  // I get called when the view needs to be shown.
  SpectacleView.prototype.show_view = function( p_parameters ){
		var self = this;
		this.view.stop();
    this.check();
		this.current_spectacle = p_parameters.id;
		
		$.each(this.model.spectacles, function(index, s){
			if (s.slug == self.current_spectacle){
				self.spectacle_index = index;
			}
		});

		this.model.get_spectacle(this.current_spectacle);
  };
  
	// I check if everything is ok for the correct display of the view.
	SpectacleView.prototype.check = function(){
		var left = $('#logo_menu');
		
		this.view.css({'top':"10000px", "display" : "block"});
	
		this.images_container = null;
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast');
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_btn.css('display', 'block');
		
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