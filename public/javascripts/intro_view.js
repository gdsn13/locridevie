window.application.addView((function( $, application ){
  
  function IntroView(){
		this.model = null;
		this.view = null;
  };
  
  IntroView.prototype.init = function(){  
		var self = this;
		
		/* INIT DATAS
		----------------------------------------------------------------------------------------*/
		this.view = $('#intro');
		this.model = application.getModel( "Model" );
		
		$(this.model).on('intro_ready', function(){
      self.refreshed_datas();
    });
  };

	IntroView.prototype.refreshed_datas = function(){
		var self = this;
		
		//chargement de la grosse image
		var img = new Image();
    $(img).load(function(){
			
			 /*var h = $(window).height();
       var w = parseInt(this.width * h / this.height);
       var mw = $(window).width();
        
       if (w > mw){
         $(this).css({'width' : mw, 'height' : parseInt(this.height * mw / this.width)});
       }else{
         $(this).css('height', h);
       }*/

			$(this).css({'width' : $(window).width()});
	
	
			$('#main_pic_intro').append(this);
			$('#texte_intro').html(self.model.current_page[0].block);
			
		}).attr('src', this.model.current_page.jules[0].picto);
				
	};

	IntroView.prototype.hide_view = function( p_parameters ){
		this.view.hide();
	}

  // I get called when the view needs to be shown.
  IntroView.prototype.show_view = function( p_parameters ){
		// ici faire un fade out du loader quand il sera en place
		this.model.set_message_to_growl("Chargement...");
		application.getModel( "LocoService" ).get_intro();
  };
  
	// I check if everything is ok for the correct display of the view.
	IntroView.prototype.check = function(){
		var left = $('#left');
		if (left.css('display') != "none"){
			left.css('display', 'none');
		}
		
		if (this.model == null) {
			this.model = application.getModel( "Model" );
		}
	};

  // ----------------------------------------------------------------------- //
  // ----------------------------------------------------------------------- //
  
  // Return a new view class singleton instance.
  return( new IntroView() );
  
})( jQuery, window.application ));