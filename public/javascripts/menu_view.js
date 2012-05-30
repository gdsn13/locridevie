window.application.addView((function( $, application ){
  
  function MenuView(){
		this.command = null;
		this.command_link = null;
		this.menu = null;
		this.model = null;
		this.close_btn = null;
		this.open = false;
		this.spectacle_slider = null;
  };
  
  MenuView.prototype.init = function(){  
		var self = this;
		
		this.command = $('#menu_command');
		this.command_link = $('#menu_command').find('a');
		this.close_btn = $('#close_menu');
		this.menu = $('#menu');
		this.model = application.getModel( "Model" );
		
		// INITIALISATION DES POSITIONS
		this.menu.css({'top' : -$(window).height(), 'height' : $(window).height() - 170});

		//ANIMATION HOVER DU BOUTON
		this.command.hover(function(){
			$(this).animate({paddingTop: "5px"}, 'fast');
		}, function(){
			$(this).animate({paddingTop: "0px"}, 'fast');
		});
		
		// OUVERTURE/FERMETURE DU MENU
		this.command_link.click(function(){
			if (self.open == false){
				self.open = true;
				self.model.call_menu_displaying();
				self.menu.animate({top:0}, 'fast');
			}
			else{
				self.hide_menu();
			}
		});
		
		//click sur close bouton
		this.close_btn.on('click', function(){
			self.hide_menu();
		});
		
		this.menu.find('a').on('click', function(){
			self.hide_menu();
		});
		
		$(this.model).on('hide_menu', function(){
			self.hide_menu();
		});		
		
		$(window).on('resize', function(){
			if (self.open == false){
				self.menu.css({'top' : -$(window).height(), 'height' : $(window).height() - 170});
			}else{
				self.menu.css({'top' : 0, 'height' : $(window).height() - 170});
			}
		});
  };

	MenuView.prototype.hide_menu = function(){  
		this.open = false;
		this.model.call_menu_hiding();
		this.menu.animate({top:-$(window).height()}, 'fast');
	}
  
  // Return a new view class singleton instance.
  return( new MenuView() );
  
})( jQuery, window.application ));