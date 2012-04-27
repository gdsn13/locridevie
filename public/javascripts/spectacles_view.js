window.application.addView((function( $, application ){
  
  function SpectaclesView(){
		this.model = null;
		this.view = null;
		this.current_ordering = null;
		this.spectacles = null;
		this.template = null;
		this.current_month_for_calendar_display = null;
		this.localize = null;
  };
  
  SpectaclesView.prototype.init = function(){  
		/* INIT
		----------------------------------------------------------------------------------------*/
		var self = this;
		this.model = application.getModel( "Model" );
		this.localize = application.getModel( "Localize" );
		this.view = $('#pages');
		this.content_area = $('#contents');
		this.template = $('#spectacle_list_template');

		/* DATA REFRESH
		----------------------------------------------------------------------------------------*/
		$(this.model).on('spectacles_ready', function(){
      self.refreshed_datas();
    });
  };

	SpectaclesView.prototype.refreshed_datas = function(){
		var self = this;
		
		switch(this.current_ordering){
			case 'programmation':
				this.spectacles = this.model.spectacles_ordered_by_name();
			break;
			case 'calendrier':
				this.spectacles = this.model.spectacles_ordered_by_date();
			break;
			case 'la-criee-en-tournee':
				this.spectacles = this.model.spectacles_en_tournee();
			break;
		}
		
		if (this.spectacles != []){
			this.display_spectacles();
		}else{
			//TODO GROWL ERROR
			alert ('eroor specatcle no spectacle');
		}
	};
	
	SpectaclesView.prototype.display_spectacles = function(){
		var self = this;
		this.content_area.html("");
		this.content_area.html("<ul id='spectacles_list'></ul>");
		var spectacle_ul = $('#spectacles_list');
		
		$.each(this.spectacles, function(index, spec){
			//ajout des mois au millieu
			if (self.current_ordering == "calendrier"){
				var month = new Date(spec.date).getMonth();
				if(self.current_month_for_calendar_display != month){
					self.current_month_for_calendar_display = month;
					spectacle_ul.append('<li class="month_name_for_calendar">' + self.localize.localize_month(month) + '</li>');
				}
			}
			spectacle_ul.append(application.getFromTemplate(self.template, spec));
		});
		
		this.view.stop().show('fast');
	};

	SpectaclesView.prototype.hide_view = function(){
		var self = this;
		this.view.stop().hide('fast', function(){
			self.content_area.html("");
			$('#jules_list').html("");
		});
	};

  // I get called when the view needs to be shown.
  SpectaclesView.prototype.show_view = function( p_parameters ){
    this.check();
		this.current_ordering = p_parameters.id;
		
		// application.currentLocation parce que la page correpondante sockée 
		// contient /spectacles (mécanique commune aux pages et spectacles)
		// par contre ordrering ne le contient pas, sert juste à ordonner correctement 
		// et est interne à cette vue.
		this.model.get_spectacles(application.currentLocation);
  };

	// I check if everything is ok for the correct display of the view.
	SpectaclesView.prototype.check = function(){
		
		//est remplie au moment ou les données sont ok.
		this.spectacles = [];
		$('#left').show('fast');
		
		//securisation des données.
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
		if (this.localize == null) {
			this.localize = application.getModel( "Localize" );
		}
	};
  
  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  // Return a new view class singleton instance.
  return( new SpectaclesView() );
  
})( jQuery, window.application ));