window.application.addView((function( $, application ){
  
  function HomeView(){
		this.model = null;
		this.view = null;
  };
  
  HomeView.prototype.init = function(){  
		var self = this;
		this.view = $('#pages');
		
		$(this.model).on('page_ready', function(){
      self.refreshed_datas();
    });
  };

	HomeView.prototype.refreshed_datas = function(){
		var self = this;
	};

  // I get called when the view needs to be shown.
  HomeView.prototype.show_view = function( p_parameters ){
		this.check();
		this.model.get_home();
  };

	// I check if everything is ok for the correct display of the view.
	HomeView.prototype.check = function(){
		var left = $('#left');

		if(left.css('display') == 'none'){
			left.show();
		}
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  // Return a new view class singleton instance.
  return( new HomeView() );
  
})( jQuery, window.application ));