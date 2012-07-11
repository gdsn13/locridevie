window.application.addView((function( $, application ){
  
  function EspaceProView(){
		this.model = null;
		this.view = null;
		this.container = null;
		this.jules_container = null;		
		this.jules = [];
		this.current_index = 0;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.currently_displayed_jules = null;
		this.formulaire_login = null;
		this.form_container = null;
		this.datas = null;
		this.dossiers_de_presse = null;
		this.disconnect = null;
		this.disconnect_container = null;
		this.fiches_techniques = null;
		this.page_container = null;
  };
  
  EspaceProView.prototype.init = function(){  
		var self = this;
		this.model = application.getModel( "Model" );
		this.view = $( '#spacepro_containers' );
		this.container = $( '#spacepro_content' );
		this.jules_container = $( '#spacepro_jules_sliders' );
		this.formulaire_login = $('form[name=login]');
		this.wrapper = $('#spacepro_wrapper');
		this.form_container = $('#login_form');
		this.disconnect = $('#disconnect');
		this.disconnect_container = $('#disconect_link');
		this.page_container = $('#pagepro_container');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spacepro_ready', function(){
      self.refreshed_datas();
    });

		$(this.model).on('spacepro_data_ready', function(){
      self.real_datas_ready();
    });

		/* SUBMIT FORM
		----------------------------------------------------------------------------------------*/
    this.formulaire_login.submit(function(e) {
			e.stopPropagation();
    	e.preventDefault();
    	self.model.get_user_and_data(self.formulaire_login.serializeArray());
    });

		/* DISCONNECT
		----------------------------------------------------------------------------------------*/
		this.disconnect.on('click', function(){
			self.form_container.fadeIn();
			self.wrapper.fadeOut('fast', function(){
				self.wrapper.html("");
			});
			self.disconnect_container.fadeOut();
			self.model.current_user = "";
			self.model.set_message_to_growl('Vous vous etes deconnecté');
			self.model.pages["pro_datas"] = null;
			var to = setTimeout(function(){
				self.model.set_message_to_growl('');
			}, 2000);
		});
  };

	EspaceProView.prototype.real_datas_ready = function(){
		this.datas = this.model.pages["pro_datas"];
		this.formulaire_login.find('input:text, input:password').val('');
		if(this.datas.user_name == "unknown"){
			this.model.set_message_to_growl("utilisateur inconnu!");
		}
		else if(this.datas.user_name == "presse"){
			this.model.current_user = "presse";
			this.display_presse();
			this.model.set_message_to_growl("");
		}else if(this.datas.user_name == "technique"){
			this.model.current_user = "technique";
			this.display_technique();
			this.model.set_message_to_growl("");
		}
		this.wrapper.css('display', 'block');
	};
	
	EspaceProView.prototype.display_presse = function(){
		var self = this;
		this.form_container.fadeOut();
		this.disconnect_container.fadeIn();
		this.wrapper.append("<ul id='dossiers_de_presse'></ul>");
		this.dossiers_de_presse = $('#dossiers_de_presse');
		
		var liste_title = "<li class='opening'>Dossier de presse</li>";
		this.dossiers_de_presse.append(liste_title);
		$.each(this.datas.datas, function(index, s){
			var html = '<li><div class="spectacle_list_numero">' + s.numero + '</div><div class="spectacle_list_title"><a href="/#/spectacle/' + s.slug + '">' + s.titre + '</a></div>';
			if (s.ddp != null) html += '<div class="presse_file_link"><a href="' + s.ddp + '">Dossier de presse</a></div>';
			if (s.images_presse != null) html += '<div class="presse_file_link"><a href="' + s.images_presse + '">Images presse</a></div>';
			html += '</li>';
			self.dossiers_de_presse.append(html);
		});
		
		Cufon.replace('.spectacle_list_numero');
		self.resize_containers();
	};
	
	EspaceProView.prototype.display_technique = function(){
		var self = this;
		this.form_container.fadeOut();
		this.disconnect_container.fadeIn();
		
		this.wrapper.append("<ul id='fiches_techniques'></ul>");
		this.fiches_techniques = $('#fiches_techniques');
		
		var liste_title = "<li class='opening'>Fiches Techniques</li>";
		this.fiches_techniques.append(liste_title);
		$.each(this.datas.datas, function(index, ft){
			var html = '<li><a href="'+ ft.url + '">' + ft.titre + '</a></li>';
			self.fiches_techniques.append(html);
		});
		self.resize_containers();
	};

	EspaceProView.prototype.refreshed_datas = function(){
		var self = this;
		this.view.css({'top':"10000px", "display" : "block", "position" : "absolute"});
		this.page_container.append(this.model.current_page.body);
		
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){
			var html = '<div class="jules_slider" id="image_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#image_' + index);
			self.jules.push(this_container);
			if (index == 0) self.currently_displayed_jules = this_container.find('img').first();
			else this_container.css('display', 'none');
		});
		
		
		// QUAND TOUT EST CHARGE DANS LA VUE
		// ---------------------------------------------------------------------------------------------------------
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.resize_containers();

			if (Modernizr.mq('(max-width: 640px)') == true){
				self.view.css({'top':"0px", "display" : "none", "position" : "static"});	
			}else{
				self.view.css({'top':"0px", "display" : "none"});	
			}
			
			$(window).on('resize', function(){ self.resize_containers(); });			
			
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE SI IL Y A PLUSIEUR JULES
				if (self.jules.length > 0){ 
					self.slider_timeout = setTimeout(function(){
						self.animate();
					}, self.slider_duration);
				}
			});
						
			self.model.set_message_to_growl("");
		});
	};
	
	EspaceProView.prototype.resize_containers = function(){

		var displayed_image = this.currently_displayed_jules;
		
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.jules_container.find('.jules_slider img').width($(window).width());
			
			this.jules_container.css({	'width': $(window).width(), 
																	'height': displayed_image.height(),
																	'position': 'absolute',
																	'top': '100px',
																	'left': '0'});
																	
			this.view.css('height', displayed_image.height() + $('#spacepro_overview').height() + 130);
																	
			$(".scrollbar").css('display', 'none');
			$(".viewport").css('height', $('#spacepro_overview').height() + 30);
																	
			this.container.css({'width': $(window).width(),
																			'top': (displayed_image.height() + 100) + "px",
																			'left': '0',
																			'height': 'auto'
																			});
		}else{
			var top_pos;

			this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.jules_container.find('.jules_slider img').width($(window).width()/2);

			top_pos = ($(window).height() - displayed_image.height())/2;

			this.jules_container.find('.jules_slider').css('top', top_pos);

			this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
			this.container.css('width', $(window).width()/2);
			this.container.css({'top' : top_pos, 'height' : displayed_image.height()});
			this.container.find('.viewport').css('height', displayed_image.height() - 10);
			this.container.tinyscrollbar({lockscroll: true});
		}
	};
	
				
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	EspaceProView.prototype.animate = function( ){
		var saved_index = this.current_index;
		var self = this;
		
		this.current_index == this.jules.length - 1 ? this.current_index = 0 : ++this.current_index;
		
		this.jules[saved_index].fadeOut( 'fast' );
		this.jules[this.current_index].fadeIn( 'fast' );
		this.currently_displayed_jules = this.jules[this.current_index].find('img').first(); 

		this.slider_timeout = setTimeout(function(){ // ce timeout s'arrete lorsque l'utilisateur clique sur une des fleches
			self.animate();
		}, this.slider_duration);
	};
	
	// tout réinitialiser! pour le prochain affichage!!!
	EspaceProView.prototype.hide_view = function(){
		var self = this;
		clearTimeout(self.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast');
		$(window).unbind('resize');
		this.jules = [];
		this.current_index = 0;
		this.wrapper.html("");
	};

	// I get called when the view needs to be shown.
  EspaceProView.prototype.show_view = function( p_parameters ){
		this.view.stop();
    this.check();
		
		this.model.get_pro_page();

		if (this.model.current_user != ""){
			this.form_container.css('display', 'none');
			this.disconnect_container.css('display', 'block');
			
			if (this.model.current_user == "presse") this.display_presse();
			else if(this.model.current_user == "technique") this.display_technique();
		}
  };

	// I check if everything is ok for the correct display of the view.
	EspaceProView.prototype.check = function(){		
		$('#logo_menu').show('fast');
		
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_btn.css('display', 'block');
		
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if (this.localize == null) {
			this.localize = application.getModel( "Localize" );
		}
	};

  return( new EspaceProView() );
  
})( jQuery, window.application ));