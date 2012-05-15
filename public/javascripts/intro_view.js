window.application.addView((function( $, application ){
  
  function IntroView(){
		this.model = null;
		this.view = null;
		this.image_container = null;
  };
  
  IntroView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.view = $('#intro');
		this.model = application.getModel( "Model" );
		this.image_container = $('#image_intro');
		
		$(this.model).on('intro_ready', function(){
      self.refreshed_datas();
    });
  };

	IntroView.prototype.initialize = function(){
		var self = this;
		$(this.model).on('intro_ready', function(){
      		self.refreshed_datas();
    	});
	};

	IntroView.prototype.refreshed_datas = function(){
		var self = this;
		var nav_intro = $('#nav_intro');
		
		//chargement de la grosse image
		var img = new Image();
    $(img).load(function(){
			// on met l'image à la bonne taille pour le full screen
			self.resize(self.image_container, $(this));
			
			// on l'ajoute
			self.image_container.append(this);
			$('#texte_intro').html(self.model.current_page.jules[0].block);
			
			// on peut ajouter les boutons!
			$.each(self.model.current_page.boutons, function(index, btn){
				nav_intro.append('<li><div class="intro_li_text">' + btn.block + '</div><img src="' + btn.img + '"width="80"/></li>')
			});
						
			self.view.show('fast');
		}).attr('src', this.model.current_page.jules[0].picto);
		
		// TODO : resize de la window
		$(window).on('resize', function(){
			self.resize(self.image_container, $(img));
		});
				
	};
	
	IntroView.prototype.resize = function(p_container,p_img) {
		
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
		this.view.fadeOut('slow');
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