// I control the primary navigation and the corresponding view of content that
// is displayed on the page. I do not control the content that is displayed within
// the primary content view (that is delegated to the other controllers).

// Add a controller to the application.
window.application.addController((function( $, application ){
  
	function Controller(){    
		this.route( "/", this.home );
		this.route( "/spectacles/programmation", this.programmation );
		this.route( "/spectacles/calendrier", this.calendrier );
		this.route( "/spectacle/:id", this.spectacle );
		this.route( "/pages.*", this.pages );
		this.route( "/newsletters", this.newsletter );
		this.route( "/espace_pro", this.spacepro);
		this.route( "/search/", this.search_engine);
		this.route( "/404", this.not_found );
		this.route( "/archives/:id", this.archives);
    
		this.view = null;
		this.current_view = null;
		this.model = null;
		this.menu_view = null;
		this.home_view = null;
		this.programmation_view = null;
		this.archives_view = null;
		this.spectacle_view = null;
		this.page_view = null;
		this.current_parameter = null;
		this.calendrier_view = null;
		this.newsletter_view = null;
		this.search = null;
  };
  
  Controller.prototype = new application.Controller();

	// ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  Controller.prototype.init = function(){
    var self = this;

		this.menu_view = application.getView( "MenuView" );
		this.home_view = application.getView( "IntroView" );
		this.page_view = application.getView( "PageView" );
		this.programmation_view = application.getView( "ProgrammationView" );
		this.archives_view = application.getView( "ArchivesView" );
		this.calendrier_view = application.getView( "CalendrierView" );
		this.newsletter_view = application.getView( "NewsletterView" );
		this.spectacle_view = application.getView( "SpectacleView" );
		this.espace_pro_view = application.getView( "EspaceProView" );
		this.search_view = application.getView( "SearchView" );
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

	Controller.prototype.home = function( event ){
		this.changeView(this.home_view, event);
	};

	Controller.prototype.programmation = function( event ){
		this.changeView(this.programmation_view, event);
	};
	
	Controller.prototype.archives = function ( event ){
		this.changeView(this.archives_view, event)
	}
	
	Controller.prototype.calendrier = function( event ){
		this.changeView(this.calendrier_view, event)
	};
	
	Controller.prototype.spectacle = function( event ){
		this.changeView(this.spectacle_view, event);
	};
	
	Controller.prototype.pages = function( event ){
		this.changeView(this.page_view, event)
	};
	
	Controller.prototype.newsletter = function ( event ){
		this.changeView(this.newsletter_view, event);
	};
	
	Controller.prototype.spacepro = function ( event ){
		this.changeView(this.espace_pro_view, event);
	};
	
	Controller.prototype.search_engine = function ( event ){
		this.changeView(this.search_view, event);
	}
	
	Controller.prototype.not_found = function( event ){
		this.model.set_message_to_growl("Page introuvable!")
	};
	
  // I show the given view; but first, I hide any existing view.
  Controller.prototype.changeView = function( p_view, p_event ){
		
		if (this.model == null) this.model = application.getModel( "Model" );
		
		//this.model.check_for_spectacles();
		
		if (this.current_view != null){
			this.current_view.hide_view();
		}
		
		this.current_view = p_view;
		this.current_parameter = p_event.parameters;
		if (p_view && p_view.show_view){
			this.menu_view.change_url(application.currentLocation);
			this.current_view.show_view( this.current_parameter );
		}
  };
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  return( new Controller() );
  
})( jQuery, window.application ));