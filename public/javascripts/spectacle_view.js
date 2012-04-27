window.application.addView((function( $, application ){
  
  function SpectacleView(){
		this.model = null;
		this.view = null;
		//this.content_area = null;
		this.current_spectacle = null;
		this.template = null;
		this.slider_container = null;
		this.images_container = null;
		this.slider_menu = null;
		this.close_button = null;
  };
  
  SpectacleView.prototype.init = function(){  
		var self = this;
		
		this.model = application.getModel( "Model" );
		this.view = $('#spectacles_container');
		//this.content_area = $('#contents');
		this.template = $('#spectacle_template');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacle_ready', function(){
      self.display_view();
    });
  };

	SpectacleView.prototype.display_view = function(){
		var self = this;
		//TODO => lancer l'anim hide, puis en call back appeller une fonction d'affichage!
		
		this.view.html(application.getFromTemplate(this.template, this.model.pages[this.current_spectacle]));
		
		//une fois que le template est ajouté, on récupére les deux zones importantes : 
		this.images_container = $('#images_spectacle');
		var image_template = $('#image_galery_for_spectacle');
		this.slider_container = $('#sliders_spectacle_containers');
		this.slider_menu = $('#sliders_spectacle_menu');
		
		console.log($('#image_galery_for_spectacle'));
		
		//generer les images
		$.each(this.model.pages[this.current_spectacle].images, function(index, img){
			self.images_container.append(application.getFromTemplate(image_template, img));
		});
		
		//generer les sliders via template, avec un champs slider dans l'objet.
		$.each(this.model.pages[this.current_spectacle].sliders, function(index, slid){
			if (slid != ""){
				var slider = '<div id="' + index + '" class="cont">' + slid;
				slider += '<a href="javascript:void(0)" class="close_button" rel="' + index + '"><img src="images/close_plus.png"/></a></div>';
				self.slider_container.append(slider);
				self.slider_menu.append('<li><a href="javascript:void(0)" rel="' + index + '" class="slider_command">' + index + '</a></li>');
			}
		});
		
		self.init_sliders_positions();
	};
	
	SpectacleView.prototype.init_sliders_positions = function(){
		var self = this;
		
		this.slider_container.find('.cont').css('left', $(window).width());
		
		//ouverture des sliders
		$('.slider_command').on('click', function(){
			var concern = $("#" + $(this).attr("rel"));

			$('.cont').animate({left: $(window).width()}, 'fast');
			
			//fermeture automatique 
			if(concern.position().left < 250){
				concern.stop().animate({right: - $(window).width() + 200 }, 'fast');
			}else{
				concern.stop().animate({left: "200px"}, 'fast');
			}			
		});
		
		//fermeture des sliders
		$('.close_button').click(function(){
			$("#" + $(this).attr("rel")).stop().animate({left: $(window).width()}, 'fast');
		});
		
		this.images_container.find('.galery_thumb').fancybox({
			prevEffect	: 'none',
			nextEffect	: 'none',
			helpers	: {
						title	: {
							type: 'outside'
						},
						overlay	: {
							opacity : 0.8,
							css : {
								'background-color' : '#000'
							}
						},
						thumbs	: {
							width	: 50,
							height	: 50
						}
			}
		});
	};
	
	SpectacleView.prototype.hide_view = function(){
		$('.slider_command').unbind('click');
		$('.close_button').unbind('click');
		this.view.hide('fast', function(){
			console.log('hide spectacle');
		});
		this.slider_menu = null;
		this.slider_container = null;
		this.images_container = null;
		this.view.html("");
		$.fancybox.cancel();
	};

  // I get called when the view needs to be shown.
  SpectacleView.prototype.show_view = function( p_parameters ){
    this.check();
		this.current_spectacle = p_parameters.id;

		this.model.get_spectacle(this.current_spectacle);
  };
  
	// I check if everything is ok for the correct display of the view.
	SpectacleView.prototype.check = function(){
		
		var left = $('#left');
		
		this.slider_menu = null;
		this.slider_container = null;
		this.images_container = null;
		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(this.view.css('display') == 'none'){
			this.view.show('fast');
		}
		if(left.css('display') == 'none'){
			left.show('fast');
		}
	};
	
  // Return a new view class singleton instance.
  return( new SpectacleView() );
  
})( jQuery, window.application ));