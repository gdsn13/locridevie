window.application.addView((function( $, application ){
  
	/* 	DESCRIPTION
	/	 	Affiche la page de garde ou d'intro du site. Une prépage avec : 
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
  };
  
  IntroView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.view = $('#home_container');
		this.model = application.getModel( "Model" );
		
		$(this.model).on('intro_ready', function(){
      self.refreshed_datas();
    });
  };

	IntroView.prototype.refreshed_datas = function(){
		var self = this;
			
		$.each(self.model.current_page.actus, function(index, actu){
			
			var img = new Image();
			$(img).load(function(){
				
				var nh = (this.height * 490)/this.width;
				$(this).css({'width' : '490px', 'height': nh });
				$(this).parent().css({'height' : nh + 1, "width" : '490px'});
				$(this).parent().parent().find('.spectacle_infos').css({'height' : nh + 1});
				
			}).attr('src', actu.img);			
			
			var first = ''
			if (index == 0) first = 'first_home ';
			
			var html = '<div class="home_item ' + first + 'home_item_' + index + '"><div class="left_content"></div>';
			html += '<div class="spectacle_infos"><h1>' + actu.title + '</h1>';
			html += '<div class="numero">' + actu.numero + '</div>';
			html += '<div class="top_spectacle">';
			html += '<div class="genre_age">' + actu.genre + '<span>' + actu.age +'</span></div>';
			html += '<div class="date_infos">' + actu.dates + '</div>';
			html += '<div class="tld">' + actu.tld + actu.block + '</div>'
			html += '</div>';
			html += '<div class="spectacle_links"><a href="/#/spectacle/' + actu.url + '">+ En savoir plus</a>';
			
			if (actu.resa != "" && actu.resa != null) html += '<a href="' + actu.resa + '">> Reservez en ligne	</a></div>'
			html += '</div></div>';
			
			self.view.append(html);
			self.view.find('.home_item_' + index + ' .left_content').append(img);
		});
		
		this.view.imagesLoaded(function($images, $proper, $broken){			
			
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){});
			
			Cufon.replace('.numero');
			
			self.model.set_message_to_growl("");
			
		});
	};

	IntroView.prototype.hide_view = function( ){
		var self = this;
		this.view.fadeOut('fast', function(){});
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
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
	 
  // Return a new view class singleton instance.
  return( new IntroView() );
})( jQuery, window.application ));