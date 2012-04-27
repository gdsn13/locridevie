window.application.addView((function( $, application ){
  
  function MenuView(){
		this.model = null;
		this.view = null;
		this.first_level = null;
  };
  
  MenuView.prototype.init = function(){  
		var self = this;
		
		this.view = $('#menu');
		this.first_level = $('#menu > li');
		/* INTERACTION
		----------------------------------------------------------------------------------------*/
		this.first_level.hover(function(){
			$(this).find('ul').show();
		}, function(){
			$(this).find('ul').hide();
		});
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		this.model = window.application.getModel( "Model" );
  };
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  // Return a new view class singleton instance.
  return( new MenuView() );
  
})( jQuery, window.application ));