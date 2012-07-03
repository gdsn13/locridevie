
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
			
	/* SPECTACLESSSSSS
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_spectacles = function(p_ordering, p_request_number){
		var self = this;

		application.ajax({
			url: p_ordering,
			success: function(json){
				self.model.set_spectacles(json, p_request_number);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	};
	
	/* SEARCH
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_search = function(p_query, p_request_number){
		var self = this;
		$.post(
			"/search",
			p_query,
			function(data) {
  			if (data.errors == null) {
					self.model.set_search(data, p_request_number);
  			} else{	
					self.model.set_message_to_growl(data.errors);
				}
  		}, 
			"json");
	}
	
	/* PRO
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_pro_page = function(p_request_number){
		var self = this;
		application.ajax({
			url: "/espace_pro_page",
			success: function(json){
				self.model.set_pro_page(json, p_request_number);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	};
	
	LocoService.prototype.get_pro = function(p_datas, p_request_number){
		var self = this;
		$.post(
			"/espace_pro_datas",
			p_datas,
			function(data) {
  			if (data.errors == null) {
					self.model.set_pro_datas(data, p_request_number);
  			} else{	
						self.model.set_message_to_growl(data.errors);
				}
  		}, 
			"json");
	};
	
	/* NEWSLETTERS
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_newsletters = function(p_request_number){
		var self = this;
		
		application.ajax({
			url: "/newsletters",
			success: function(json){
				self.model.set_newsletters(json, p_request_number);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	}
	
	/* CALENDRIER
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_calendrier = function(p_request_number){
		var self = this;
		
		application.ajax({
			url: "/calendrier",
			success: function(json){
				self.model.set_calendrier(json, p_request_number);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	};
	
	/* SPECTACLE
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_spectacle = function(p_slug, p_request_number){
		var self = this;

		application.ajax({
			url: '/spectacle/' + p_slug,
			success: function(json){
				self.model.set_spectacle(json, p_request_number);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	};
	
	/* INTRO
	----------------------------------------------------------------------------------------*/
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
	
	/* PAGES
	----------------------------------------------------------------------------------------*/
	LocoService.prototype.get_page = function(p_page_slug, p_request_number){
		var self = this;
		
		application.ajax({
			url: p_page_slug,
			success: function(json){
				self.model.set_page(json, p_request_number);
			},
			error: function(json){
				self.model.set_message_to_growl(json.statusText);
			}
		});
	};
		
	// Return a new model class singleton instance.
	return( new LocoService() );
})( jQuery, window.application ));