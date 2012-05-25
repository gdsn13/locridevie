// I control the primary navigation and the corresponding view of content that
// is displayed on the page. I do not control the content that is displayed within
// the primary content view (that is delegated to the other controllers).

// Add a controller to the application.
window.application.addController((function( $, application ){
  
	function Controller(){    
    this.route( "/", this.intro );
		this.route( "/home_page", this.home );
		this.route( "/spectacles/programmation", this.programmation );
		this.route( "/spectacles/calendrier", this.calendrier );
		this.route( "/spectacle/:id", this.spectacle );
		this.route( "/pages.*", this.pages );
		//this.route( "/newsletter", this.newsletter );
		this.route( "/404", this.not_found );
    
		this.view = null;
		this.current_view = null;
		this.model = null;
		this.intro_view = null;
		this.menu_view = null;
		this.site_view = null;
		this.programmation_view = null;
		this.spectacle_view = null;
		this.page_view = null;
		this.current_parameter = null;
		this.calendrier_view = null;
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
		this.programmation_view = application.getView( "ProgrammationView" );
		this.calendrier_view = application.getView( "CalendrierView" );
		this.spectacle_view = application.getView( "SpectacleView" );
		//this.newsletter_view = application.getViex( "NewsletterView" );
		this.model = application.getModel( "Model" );
		
		$(window).load(function(){
			self.model = application.getModel( "Model" );
		});
		
		$(this.model).on('hide_finished', function(){
			self.show_current_view();
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

	Controller.prototype.programmation = function( event ){
		this.changeView(this.programmation_view, event);
	};
	
	Controller.prototype.calendrier = function( event ){
		this.changeView(this.calendrier_view, event)
	};
	
	Controller.prototype.spectacle = function( event ){
		this.changeView(this.spectacle_view, event);
	};
	
	Controller.prototype.pages = function( event ){
		this.changeView(this.page_view, event)
	};
	
	/*controller.prototype.newsletter = function ( event ){
		this.changeView(this.newsletter_view, event);
	};*/
	
	
	Controller.prototype.not_found = function( event ){
		this.model.set_message_to_growl("Page Not Found!")
	};
	
  // I show the given view; but first, I hide any existing view.
  Controller.prototype.changeView = function( p_view, p_event ){
	
		if (this.model == null) this.model = application.getModel( "Model" );
		
		if (p_view != this.intro_view){
			this.model.check_for_spectacles();
		}
		
		if (this.current_view != null){
			this.current_view.hide_view();
		}
		
		this.current_view = p_view;	
		this.current_parameter = p_event.parameters;
		if (p_view && p_view.show_view){
			this.current_view.show_view( this.current_parameter );
		}
  };
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  return( new Controller() );
  
})( jQuery, window.application ));