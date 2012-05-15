window.application.addView((function( $, application ){
  
  function NewsletterView(){
		this.view = null;
		this.model = null;
  };
  
  NewsletterView.prototype.init = function(){  
		this.model = application.getModel( "model" );
  };

  return( new NewsletterView() );
  
})( jQuery, window.application ));