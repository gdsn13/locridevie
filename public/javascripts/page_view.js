window.application.addView((function( $, application ){
  
  function PageView(){
		this.model = null;
		this.view = null;
		this.content_view = null;
		this.jules_container = null;
		this.bck_img = null;
		this.boutons_container = null;
  };
  
  PageView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.jules_container = $('#jules_list');
		this.boutons_container = $('#buttons_containers');
		this.model = application.getModel( "Model" );
		this.content_view = $('#contents');
		this.view = $('#pages');
		this.bck_img = $('#bck_img');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('page_ready', function(){
			self.data_ready();
    });
  };

	PageView.prototype.data_ready = function(){
		var self = this;
		self.jules_container.html("");
		self.boutons_container.html("");
		self.content_view.html("");
		self.bck_img.html("");
		
		// AFFICHAGE DES DIFFERENTS ELEMENT DE LA PAGE
    self.display_boutons();
		self.display_actus();
		self.display_jules();
		self.display_body();
		
		if (this.model.current_page.picto != ""){
			self.dispay_picto();
		}
		
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.view.show('fast');
		});
	};

	PageView.prototype.dispay_picto = function(){
		var self = this;
		//on charge l'image, on l'ajoute au bon background!
		var img = new Image();
    $(img).load(function(){
			self.resize(self.bck_img, $(this));
			// on ajoute au back
			self.bck_img.html(this);
		}).attr('src', this.model.current_page.picto);
	};

	PageView.prototype.display_boutons = function(){
		var self = this;
		if (this.model.current_page.actus != null){
			$.each(this.model.current_page.boutons, function(index, b){
				if (b.son != null){
					var son_associe = soundManager.createSound({
					 	id: 'mySound2',
					 	url: b.son
					});
					son_associe.play();
				}
				self.boutons_container.append('<div class="btn"><a href="' + b.url + '"><img src="' + + '"/></a></div>')
			});
		}
	};
	
	PageView.prototype.display_body = function(){
		this.content_view.html(this.model.current_page.body);
	};
  
	PageView.prototype.display_actus = function(){
		var self = this;
		
		if (this.model.current_page.actus != null){
			$.each(this.model.current_page.actus.reverse(), function(index, j){
				self.jules_container.prepend(j.block);
			});
		}
	};

	PageView.prototype.display_jules = function(){
		var self = this;
		
		if (this.model.current_page.jules != null){
			$.each(this.model.current_page.jules.reverse(), function(index, j){
				self.jules_container.prepend(j.block);
			});
		}
	};
	
	PageView.prototype.hide_view = function(){
		var self = this;
		this.view.fadeOut('fast', function(){});
	};
	
	PageView.prototype.show_view = function(){
		this.check();
		this.model.get_page(application.currentLocation.slice(application.currentLocation.indexOf("/"), application.currentLocation.length));
	};
	
	// I check if everything is ok for the correct display of the view.
	PageView.prototype.check = function(){
		var menu = $('#logo_menu');
		$('body').css({'overflow-y': 'scroll'});
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(menu.css('display') == 'none'){
			menu.show();
		}
	};
	
	PageView.prototype.resize = function(p_container,p_img) {
		
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
	};
  
  // Return a new view class singleton instance.
  return( new PageView() );
  
})( jQuery, window.application ));