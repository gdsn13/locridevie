window.application.addView((function( $, application ){
  
  function HomeView(){
		this.model = null;
		this.view = null;
		this.jules_container = null;
		this.actus_container = null;
		this.actus_template = null;
		this.boutons_container = null;
		this.boutons_template = null;
  };
  
  HomeView.prototype.init = function(){  
		var self = this;
		
		this.view = $('#home');
		this.jules_container = $('#home_jules');
		this.actus_container = $('#home_news');
		this.boutons_container = $('#home_boutons');
		this.actus_template = $('#home_actus_template');
		this.boutons_template = $('#boutons_actus_template');
		
  };

	HomeView.prototype.refreshed_datas = function(){
		var self = this;
		
		// display Jules
		this.display_jules();
		// display news
		this.display_actus();
		//display boutons
		this.display_boutons();
		
		// quand les images sont chargées sur la vue, on show et on masone! et on enleve le loader
		this.view.imagesLoaded(function($images, $proper, $broken){
			self.model.set_message_to_growl("");
			self.view.fadeIn('slow');
			$('#home_news').masonry({itemSelector: '.home_actus'});
		});
	};

	// I get called when the view needs to be shown.
  HomeView.prototype.display_jules = function( ){
		var self = this;
		
		$.each(this.model.current_page.jules, function(index, j){
			var jule_code = "<a href='" + j.url + "'>" + j.block + "</a>"
			self.jules_container.append(jule_code);
		});
  };

	// I get called when the view needs to be shown.
  HomeView.prototype.display_actus = function( ){
		var self = this;

		$.each(this.model.current_page.actus, function(index, a){
			self.actus_container.append(application.getFromTemplate(self.actus_template, a));
		});
  };

	// I get called when the view needs to be shown.
  HomeView.prototype.display_boutons = function( ){
	var self = this;
	
		$.each(this.model.current_page.boutons, function(index, b){
			self.boutons_container.append(application.getFromTemplate(self.boutons_template, b));
		});
  };

  HomeView.prototype.hide_view = function(  ){
		var self = this;
		this.view.fadeOut('fast');
  };

  // I get called when the view needs to be shown.
  HomeView.prototype.show_view = function( p_parameters ){
		this.check();
		this.model.get_home();
  };

	// I check if everything is ok for the correct display of the view.
	HomeView.prototype.check = function(){
		var self = this;
		var left = $('#logo_menu');
		var ss = $('#spectacle_slider');
		if( ss.css('display') == 'none') ss.fadeIn('fast');

		$('#menu').css('display', 'block');
		if(left.css('display') == 'none'){
			left.show();
		}
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		$(this.model).on('home_datas_ready', function(){
		   self.refreshed_datas();
		});
	};
  
  // Return a new view class singleton instance.
  return( new HomeView() );
})( jQuery, window.application ));