window.application.addView((function( $, application ){
	
	
	/*
	/	TRICKS : le sliders des images joue sur l'opacité puisque si display = none, on a plus accés aux informations de l'image (height et width)
	/
	/
	----------------------------------------------*/
  
  function SpectacleView(){
		this.model = null;
		this.view = null;
		this.current_spectacle = null;
		this.template = null;
		//this.slider_container = null;
		this.images_container = null;
		//this.slider_menu = null;
		this.close_button = null;
		this.spectacles_sliders = null;
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
		var self = this;
		this.current_index = 0;
		this.slider_menu = null;
		//this.slider_container = null;
		this.images_container = null;
		this.view.html("");
		//$('.slider_command').unbind('click');
		//$('.close_button').unbind('click');	
		
		// on affiche la vue.
		this.view.html(application.getFromTemplate(this.template, this.model.pages[this.current_spectacle]));

		// INITALISATION DES CONTAINERS 
		this.images_container = $('#images_spectacle');
		this.spectacles_sliders = $('#spectacles_sliders');
		var image_template = $('#image_galery_for_spectacle');
		//this.slider_container = $('#sliders_spectacle_containers');
		this.slider_menu = $('#sliders_spectacle_menu');
		
		//INITIALISATION DES TAILLES DES CONTAINERS
		this.images_container.css({'width': $(window).width()/2, 'height' : "100%"});
		this.spectacles_sliders.css('width', $(window).width()/2 - 20 ); //100 de margin!
		
		// GENERATION DES IMAGES
		$.each(this.model.pages[this.current_spectacle].images, function(index, img){
			img.index = index;
			self.images_container.append(application.getFromTemplate(image_template, img));
			var current = self.images_container.find('#image_'+index);
			self.images.push(current);
		});
		
		// RESIZE DES IMAGES UNE FOIS QU'ELLES SONT CHARGEES
		this.images_container.find('img').load(function(){
			var img = this;
			self.resize($(this).parent(), $(this));
			$(window).on('resize', function(){
				self.resize($(img).parent(), $(img));
			});
		});
		
		//GENERATION DES SLIDERS
		$.each(this.model.pages[this.current_spectacle].sliders, function(index, slid){
			if (slid != ""){
				var slider = '<div id="' + index + '" class="cont">' + slid;
				slider += '<a href="javascript:void(0)" class="close_button" rel="' + index + '"><img src="/theme/images/close_plus.png"/></a></div>';
				self.slider_container.append(slider);
				self.slider_menu.append('<li><a href="javascript:void(0)" rel="' + index + '" class="slider_command"><img src="/theme/images/' + index + '.png"/></a></li>');
			}
		});
		
		//INITIALISATION DE LA POSITION DES SLIDERS
		self.init_sliders_positions();
		
		this.view.imagesLoaded(function(){
			$(window).resize(function(){
				self.images_container.css({'width': $(window).width()/2, 'height':$(window).height()});
				self.spectacles_sliders.css('width', $(window).width()/2 - 20 );	
				if( self.slider_container.find('.cont') != null ){
					self.slider_container.find('.cont').css({'left' : $(window).width(), 'width' : $(window).width()/2 - 150});
				}
			});
			
			//INIT DU SCROLLER
			self.spectacles_sliders.tinyscrollbar({lockscroll: true});
			
			
			// ON AFFICHE LA VUE
			self.view.animate({opacity:1},'fast', function(){
				// LANCEMENT DU FULL-SLIDER
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
		
		//if (this.auto == true){
			this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
				self.animate("next");
			}, this.slider_duration);
		//}
	};
	
	SpectacleView.prototype.init_sliders_positions = function(){
		var self = this;
		// POSITIONNEMENT DES SLIDERS
		this.slider_container.find('.cont').css({'left' : $(window).width() + 20, 'width' : $(window).width()/2 - 150});
		
		
		// OUVERTURE DES SLIDERS
		$('.slider_command').on('click', function(){
			var concern = $("#" + $(this).attr("rel"));

			// ON FERME TOUS LES SLIDER
			$('.cont').animate({left: $(window).width() + 200}, 'fast');
			
			//TOGGLE SLIDER, SI DEJA OUVERT? ON RECLIQUE, ON REFERME
			if(concern.position().left < $(window).width()){
				concern.stop().animate({left: $(window).width() + 200 }, 'fast');
			}else{
				concern.stop().animate({left: $(window).width()/2}, 'fast');
			}			
		});
		
		// FERMETURE PAR BOUTON
		$('.close_button').click(function(){
			$("#" + $(this).attr("rel")).stop().animate({left: $(window).width()}, 'fast');
		});
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
		
		this.slider_menu = null;
		this.slider_container = null;
		this.images_container = null;
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast');
		var ft = $('#footer');
		if( ft.css('display') == 'none') ft.fadeIn('fast');
		
		$('body').css({'overflow-y': 'auto'});
		this.view.css({'display' : 'block', 'opacity' : '0'});
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(left.css('display') == 'none'){
			left.show('fast');
		}
	};
	
	//je resize la photo
	SpectacleView.prototype.resize = function(p_container, p_img) {				
		p_img.width($(window).width()/2);
		var top_pos = ($(window).height() - p_img.height())/2;
		p_container.css('top', top_pos);
		this.spectacles_sliders.css({'top' : top_pos + 10, 'height' : p_img.height() - 10});
		this.spectacles_sliders.find('.viewport').css('height', p_img.height() - 10);
		this.spectacles_sliders.tinyscrollbar({lockscroll: true});	
	};
	
  // Return a new view class singleton instance.
  return( new SpectacleView() );
  
})( jQuery, window.application ));