
// I am the gateway to the contacts collection within the system. For this
// demo, there is no communication with the server - all contacts are stored
// locally and internally to this service object.

// Add model to the application.
window.application.addModel((function( $, application ){

	// I am the contacts service class.
	function LocoService(){
		this.model = null;
	};

	LocoService.prototype.init = function(){
		this.model = application.getModel("Model");
	};
			
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	LocoService.prototype.get_spectacles = function(p_ordering){
		
		var self = this;

		application.ajax({
			url: p_ordering,
			success: function(json){
				self.model.set_spectacles(json);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
		
	};
	
	LocoService.prototype.get_spectacle = function(p_slug){
		
		var self = this;

		application.ajax({
			url: '/spectacle/' + p_slug,
			success: function(json){
				self.model.set_spectacle(json);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
		
	};
	
	LocoService.prototype.get_intro = function(){
		
		var self = this;

		application.ajax({
			url: '/intro',
			success: function(json){
				self.model.set_intro(json);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
		
	};
	
	LocoService.prototype.get_page = function(p_page_slug){
		var self = this;
		
		application.ajax({
			url: p_page_slug,
			success: function(json){
				self.model.set_page(json);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	};
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //

	
	// Return a new model class singleton instance.
	return( new LocoService() );
	
})( jQuery, window.application ));