window.application.addView((function( $, application ){
  
  function PageView(){
		this.model = null;
		this.view = null;
		this.content_view = null;
		this.jules_container = null;
		this.content_container = null;
		this.jules = [];
		this.currently_displayed_jules = null;
		this.slider_timeout = null;
		this.slider_duration = 5000;
		this.current_index = 0;
  };
  
  PageView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.jules_container = $('#jules_list');
		this.model = application.getModel( "Model" );
		this.content_view = $('#contents');
		this.view = $('#pages');
		this.content_container = $('#content_static_container');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on( 'page_ready', function(){
			self.data_ready();
    });
  };

	PageView.prototype.data_ready = function(){
		var self = this;
		// etre sur que la view est en display block, sinon, pas de calcul de tailles
		this.view.css({'top':"10000px", "display" : "block", "position" : "absolute"});
				
		//AFFICHAGE DES JULES
		$.each(this.model.current_page.jules, function(index, j){						
			var html = '<div class="jules_slider" id="jules_' + index +'"><img src="' + j.picto + '"/></div>';
			self.jules_container.append(html);
			var this_container = $('#jules_' + index);
			self.jules.push(this_container);
			if (index == 0) self.currently_displayed_jules = this_container.find('img').first();
			else this_container.css('display', 'none');
		});
		
		//AFFICHAGE DU BODY
		this.content_container.html(this.model.current_page.body);
		
		this.view.imagesLoaded(function(){
			$(window).on('resize', function(){ self.resize_containers(); });
			
			//INIT DES POS DES CONTAINERS
			self.resize_containers();
			
			if (Modernizr.mq('(max-width: 640px)') == true){
				self.view.css({'top':"0px", "display" : "none", "position" : "static"});	
			}else{
				self.view.css({'top':"0px", "display" : "none"});	
			}
				
			
			// ON AFFICHE LA VUE
			self.view.fadeIn('fast', function(){
				// LANCEMENT DU FULL-SLIDER A LA FIN DE L'AFFICHAGE
				if (self.jules.size < 2){
					self.slider_timeout = setTimeout(function(){
						self.animate();
						}, self.slider_duration);
				}
			});

			self.model.set_message_to_growl("");			// on cache le loader
		});
	};
	
	// SLIDE DANS LA BONNE DIRECTION LE SLIDER.
	PageView.prototype.animate = function(){
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
	
	PageView.prototype.resize_containers = function(){
		var displayed_image = this.currently_displayed_jules;
		
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.jules_container.find('.jules_slider img').width($(window).width());
			
			this.jules_container.css({	'width': $(window).width(), 
																	'height': displayed_image.height(),
																	'position': 'absolute',
																	'top': '100px',
																	'left': '0'});
																	
			this.view.css('height', displayed_image.height() + this.content_container.height() + 130);
																	
			$(".scrollbar").css('display', 'none');
			$(".viewport").css('height', this.content_container.height() + 30);
																	
			this.content_view.css({'width': $(window).width(),
																			'top': (displayed_image.height() + 100) + "px",
																			'left': '0',
																			'height': 'auto'
																			});
		}else{
			if (displayed_image != null){
				var top_pos;

				this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
				this.jules_container.find('.jules_slider img').width($(window).width()/2);

				top_pos = ($(window).height() - displayed_image.height())/2;

				this.jules_container.find('.jules_slider').css('top', top_pos);

				this.jules_container.css({'width': $(window).width()/2, 'height':$(window).height()});
				this.content_view.css('width', $(window).width()/2);
				this.content_view.css({'top' : top_pos, 'height' : displayed_image.height()});
				this.content_view.find('.viewport').css('height', displayed_image.height() - 10);
				this.content_view.tinyscrollbar({lockscroll: true});
			}
		}
	};
	
	PageView.prototype.hide_view = function(next_view_is_page){
		var self = this;
		clearTimeout(this.slider_timeout);
		this.slider_timeout = null;
		this.view.fadeOut('fast', function(){});
		this.view.css('display', 'none');
		$( window ).unbind();
		this.jules_container.html("");
		this.content_container.html("");
		this.jules = [];
		this.current_index = 0;
	};
	
	PageView.prototype.show_view = function(){
		this.view.stop();
		this.check();
		this.model.get_page(application.currentLocation.slice(application.currentLocation.indexOf("/"), application.currentLocation.length));
	};
	
	// I check if everything is ok for the correct display of the view.
	PageView.prototype.check = function(){
		var menu = $('#logo_menu');

		//check que le slider soit bien affiché
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast'); 
		
		var menu_btn = $('#menu_command');
		if (menu_btn.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_btn.css('display', 'block');
		var menu_bis = $('#menu_important');
		if (menu_bis.css('display') != "block" && Modernizr.mq('(max-width: 640px)') != true) menu_bis.css('display', 'block');
		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(menu.css('display') == 'none'){
			menu.show();
		}
	};
  
  // Return a new view class singleton instance.
  return( new PageView() );
  
})( jQuery, window.application ));