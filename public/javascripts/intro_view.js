window.application.addView((function( $, application ){
  
	/* 	DESCRIPTION
	/	 	Affiche la page de gaurde ou d'intro du site. Une prépage avec : 
	/		- soit l'image bck_img de la page racine du site (slug = index), en width 100%
	/		- soit un jules associé à la page slug = index (et un seul) avec une image en cover et un texte en hover si besoin.
	/		- une liste de boutons qui redirigent directement vers des pages du site (image + texte + lien)
	/
	/		Si le jules est présent, on l'affihce, sinon on affiche la bck_img
	/		
	/ 	format des données serveurs : 
	/
	/		{
	/			"boutons":[
	/				{"title":"bouton un prog","img":"/contents/boutons/4fb25cb2fc70f501f20000d9/apaches-talons.jpg","url":"","block":"<p>cliquez <a href=\"/#/spectacles/programmation\">ici</a> pour acc&eacute;der au programme</p>","son":null},
	/				{"title":"bouton entrez","img":"/contents/boutons/4fb25cf4fc70f501f20000db/MM_saison.png","url":"","block":"<p>entrez par <a href=\"/#/home_page\">ici</a></p>","son":null}
	/			],
	/			"logo":"/contents/pages/4facd19cfc70f5c727000007/Saison1213criee_pgegarde.png",
	/			"jules":[
	/				{"name":"full intro","url":"","block":"<h1>Bienvenus</h1>","picto":"/contents/jules/4fb24da8fc70f501f2000002/MM_photo004.jpg"}
	/			]
	/		}
	/		
	----------------------------------------------------------------------------------------*/

  function IntroView(){
		this.model = null;
		this.view = null;
		this.image_container = null;
		this.logo_container = null;
		this.jules_is_there = false;
		this.logo_link = null;
  };
  
  IntroView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.view = $('#intro');
		this.model = application.getModel( "Model" );
		this.image_container = $('#image_intro');
		this.logo_container = $('#logo_link');
		
		$(this.model).on('intro_ready', function(){
      self.refreshed_datas();
    });
  };

	IntroView.prototype.refreshed_datas = function(){
		var self = this;
		var nav_intro = $('#nav_intro');
		this.view.css({'top':"10000px", "display" : "block"});
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
						
				self.view.css({'top':"0px", "display" : "none"});
				self.view.fadeIn('fast');
			}).attr('src', this.model.current_page.jules[0].picto);
		}else{
			// on affiche l'image de fond de la page
			var img = new Image();
			$(img).load(function(){
				//var html = "<a href='/#/home_page' id='logo_link'><img src='" + $(this).attr('src') + "'/></a>";
				self.logo_container.append(this);

				self.resize_logo($(this));
	
				self.view.css({'top':"0px", "display" : "none"});
				self.view.fadeIn('fast');
				
			}).attr('src', this.model.current_page.logo);
		}
		
		nav_intro.html('');
		// on ajoute les boutons!
		$.each(self.model.current_page.boutons, function(index, btn){
			nav_intro.append('<li><a href="' + btn.url + '">' + btn.title + '</a></li>')
		});
				
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
		this.logo_container.css({'position': 'absolute', 'top' : pos_top, 'left' : pos_left, 'height' : p_img.height(), 'width' : p_img.width() });
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
		if (this.jules_is_there == true) this.image_container.html('');
		this.logo_container.html('');
		this.view.fadeOut('fast', function(){

		});
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
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "none"){
			menu_btn.css('display', 'none');
		}
		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		//spectacles ne dois pas s'afficher
		$('#spectacle_slider').css('display', 'none');
	};
	 
  // Return a new view class singleton instance.
  return( new IntroView() );
})( jQuery, window.application ));