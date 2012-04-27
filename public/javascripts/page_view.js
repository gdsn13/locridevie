window.application.addView((function( $, application ){
  
  function PageView(){
		this.model = null;
		this.pages_container = null;
		this.view = null;
		this.content_view = null;
		this.jules_container = null;
  };
  
  PageView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.jules_container = $('#jules_list');
		this.boutons_container = $('#buttons_containers');
		this.model = application.getModel( "Model" );
		this.content_view = $('#contents');
		this.pages_container = $('#pages');
		this.view = $('#pages');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('page_ready', function(){
			
			if(self.pages_container.css('display') == 'none'){
				self.pages_container.show();
			}
			
			self.jules_container.html("");
      self.display_boutons();
			self.display_actus();
			self.display_jules();
			self.display_body();
    });
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
		this.view.hide('fast');
	};
	
	PageView.prototype.show_view = function(){
		this.check();
		
		var fullpath = application.currentLocation.slice(application.currentLocation.indexOf("/"), application.currentLocation.length);
		this.model.get_page(fullpath);
	};
	
	// I check if everything is ok for the correct display of the view.
	PageView.prototype.check = function(){
		var left = $('#left');

		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if(this.view.css('display') == 'none'){
			this.view.show();
		}
		if(left.css('display') == 'none'){
			left.show();
		}
	};

  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  // Return a new view class singleton instance.
  return( new PageView() );
  
})( jQuery, window.application ));