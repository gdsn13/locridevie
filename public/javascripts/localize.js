
// I am the gateway to the contacts collection within the system. For this
// demo, there is no communication with the server - all contacts are stored
// locally and internally to this service object.

// Add model to the application.
window.application.addModel((function( $, application ){

	// I am the contacts service class.
	function Localize(){
		this.model = null;
		this.current_language = "fr";
	};

	Localize.prototype.init = function(){
		this.model = application.getModel("Model");
	};
	
	Localize.prototype.set_language = function(p_lang){
		this.current_language = p_lang;
	};
	
	Localize.prototype.localize_month = function(p_month){
		return eval(this.current_language + ".monthNames[" + p_month + "]");
	};

	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //

	
	// Return a new model class singleton instance.
	return( new Localize() );
	
})( jQuery, window.application ));