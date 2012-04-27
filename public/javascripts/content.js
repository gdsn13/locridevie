// I control the primary navigation and the corresponding view of content that
// is displayed on the page. I do not control the content that is displayed within
// the primary content view (that is delegated to the other controllers).

// Add a controller to the application.
window.application.addController((function( $, application ){
  
	function Controller(){    
    this.route( "/", this.intro );
		this.route( "/home_page", this.home );
		this.route( "/spectacles/:id", this.spectacles );
		this.route( "/spectacle/:id", this.spectacle );
		this.route( "/pages.*", this.pages );
		this.route( "/404", this.not_found );
    
		this.view = null;
		this.current_view = null;
		this.model = null;
		this.intro_view = null;
		this.menu_view = null;
		this.site_view = null;
		this.spectacles_view = null;
		this.spectacle_view = null;
		this.page_view = null;
  };
  
  Controller.prototype = new application.Controller();

	// ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  Controller.prototype.init = function(){
    var self = this;

		this.intro_view = application.getView( "IntroView" );
		this.menu_view = application.getView( "MenuView" );
		this.site_view = application.getView( "HomeView" );
		this.page_view = application.getView( "PageView" );
		this.spectacles_view = application.getView( "SpectaclesView" );
		this.spectacle_view = application.getView( "SpectacleView" );		
		
		$(window).load(function(){
			self.model = application.getModel( "Model" );
		});
  };

  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //

  Controller.prototype.intro = function( event ){
		this.changeView(this.intro_view, event);
  };

	Controller.prototype.home = function( event ){
		this.changeView(this.site_view, event);
	};

	Controller.prototype.spectacles = function( event ){
		this.changeView(this.spectacles_view, event);
	};
	
	Controller.prototype.spectacle = function( event ){
		this.changeView(this.spectacle_view, event);
	};
	
	Controller.prototype.pages = function( event ){
		this.changeView(this.page_view, event)
	};
	
	Controller.prototype.not_found = function( event ){
		this.model.set_message_to_growl("Page Not Found!")
	};
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  // I show the given view; but first, I hide any existing view.
  Controller.prototype.changeView = function( p_view, p_event ){
		if (this.current_view != null){
			this.current_view.hide_view();
		}
		
		this.current_view = p_view;
				
		if (p_view && p_view.show_view){
			this.current_view.show_view( p_event.parameters );
		}	
  };
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  return( new Controller() );
  
})( jQuery, window.application ));