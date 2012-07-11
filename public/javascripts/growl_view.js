window.application.addView((function( $, application ){
  
  function GrowlView(){
		this.model = null;
		this.view = null;
  };
  
  GrowlView.prototype.init = function(){  
		var self = this;
		this.view = $('#growl_messages');
		this.model = application.getModel( "Model" );
		this.spectacle_slider = $('#spectacle_slider');
		
		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('messaging', function(){
			if (self.model.message_to_growl == ""){
				self.hide_message();
			}else{
				self.show_message();	
			}
		});
  };

	GrowlView.prototype.show_message = function(){
		this.view.html(this.model.message_to_growl);
		this.view.animate({"marginTop": 0});
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.spectacle_slider.css("padding-top", 100);
		}
	};
	
	GrowlView.prototype.hide_message = function(){
		var self = this;
		
		var new_margin = this.view.height() + 40;
		this.view.animate({"marginTop": -new_margin}, function(){
			self.view.html("");
		});
		
		if (Modernizr.mq('(max-width: 640px)') == true){
			this.spectacle_slider.css("padding-top", 0);
		}
	};
  
  // Return a new view class singleton instance.
  return( new GrowlView() );
  
})( jQuery, window.application ));