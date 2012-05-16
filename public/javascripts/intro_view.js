window.application.addView((function( $, application ){
  
  function IntroView(){
		this.model = null;
		this.view = null;
		this.image_container = null;
		this.logo_container = null;
		this.jules_is_there = false;
  };
  
  IntroView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.view = $('#intro');
		this.model = application.getModel( "Model" );
		this.image_container = $('#image_intro');
		this.logo_container = $('#logo_intro');
		
		$(this.model).on('intro_ready', function(){
      self.refreshed_datas();
    });
  };

	IntroView.prototype.refreshed_datas = function(){
		var self = this;
		var nav_intro = $('#nav_intro');
		this.jules_is_there = false;
		
		if (this.model.current_page.jules.length > 0){
			
			this.jules_is_there = true;
			//chargement de la grosse image
			var img = new Image();
		  $(img).load(function(){
				// on ajoute l'image et le texte
				self.image_container.append(this);
				$('#texte_intro').html(self.model.current_page.jules[0].block);
			
				// on met l'image à la bonne taille pour le full screen
				self.resize(self.image_container, $(this));
						
				self.view.fadeTo('fast', 1);
			}).attr('src', this.model.current_page.jules[0].picto);
		}else{
			// on affiche l'image de fond de la page
			var img = new Image();
			$(img).load(function(){
				self.logo_container.append(this);
				
				self.resize_logo($(this));
	
				self.view.fadeTo('fast', 1);
				
			}).attr('src', this.model.current_page.logo);
		}
		
		// on ajoute les boutons!
		$.each(self.model.current_page.boutons, function(index, btn){
			nav_intro.append('<li><div class="intro_li_text">' + btn.block + '</div><img src="' + btn.img + '"width="80"/></li>')
		});
				
		// TODO : resize de la window
		$(window).on('resize', function(){
			if (self.jules_is_there == true){
				self.resize(self.image_container, $(img));
			}else{
				self.resize_logo(self.logo_container.find('img'));
			}
		});
				
	};
	
	IntroView.prototype.resize_logo = function ( p_img ){
		//initialisation des tailles
		p_img.width($(window).width() - 100);
		var pos_top = ($(window).height() - 62 - p_img.height())/2;
		var pos_left = ($(window).width() - p_img.width())/2;

		//affectation des tailles
		p_img.css({'top' : pos_top, 'left' : pos_left});
	};
	
	IntroView.prototype.resize = function( p_container,p_img ) {
		
		//Define starting width and height values for the original image
		var start_width = p_img.width();  
		var start_height = p_img.height();
		//Define image ratio
		var ratio = start_height/start_width;
		//Gather browser dimensions
		var browser_width = $(window).width();
		var browser_height = $(window).height();
		//Resize image to proper ratio
		if ((browser_height/browser_width) > ratio) {
			p_container.height(browser_height);
		  p_container.width(browser_height / ratio);
		  p_img.height(browser_height);
		  p_img.width(browser_height / ratio);
		} else {
		  p_container.width(browser_width);
		  p_container.height(browser_width * ratio);
		  p_img.width(browser_width);
		  p_img.height(browser_width * ratio);
	  }
		
		//Make sure the image stays center in the window
		p_img.css('left', (browser_width - p_container.width())/2);
		p_img.css('top', (browser_height - p_container.height())/2);
	};
	

	IntroView.prototype.hide_view = function( ){
		var self = this;
		this.view.fadeTo('fast', 0);
	}

  // I get called when the view needs to be shown.
  IntroView.prototype.show_view = function( p_parameters ){
		// ici faire un fade out du loader quand il sera en place
		this.model.set_message_to_growl("Chargement...");
		this.check();
		application.getModel( "LocoService" ).get_intro();
  };
  
	// I check if everything is ok for the correct display of the view.
	IntroView.prototype.check = function(){
		var left = $('#logo_menu');
		if (left.css('display') != "none"){
			left.css('display', 'none');
		}
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		//spectacles ne dois pas s'afficher
		$('#spectacle_slider').css('display', 'none');
		$('body').css({'overflow-y': 'hidden'});
	};
	 
  // Return a new view class singleton instance.
  return( new IntroView() );
})( jQuery, window.application ));