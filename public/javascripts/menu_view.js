window.application.addView((function( $, application ){
  
  function MenuView(){
		this.view = null;
		this.first_level = null;
		this.menu = null;
		this.menu_up_to = null;
  };
  
  MenuView.prototype.init = function(){  
		var self = this;
		
		this.view = $('#logo_menu');
		this.first_level = $('#menu > li');
		this.menu = $('#menu');
		this.menu.css('top', -$(window).height());

		// fait apparaitre le menu, le menu ne se range que l'orsqu'on clique sur un élément.
		//OPEN MENU
		this.view.hover(function(){
			//clearTimeout(self.menu_up_to);
			//self.menu_up_to = null;
			self.menu.animate({top: 0}, 'fast');
			//self.close_btn.fadeIn('fast');
		});
		
		//CLOSE MENU
		this.menu.on('mouseleave', function(){
			//clearTimeout(self.menu_up_to);
			//self.menu_up_to = null;
			//self.menu_up_to = setTimeout(self.up_menu, 5000);
			self.menu.animate({top: -$(window).height()});
			//self.close_btn.fadeOut('fast');
		})
  };

	MenuView.prototype.up_menu = function( p_menu ){  
		var menu = $('#menu');
		menu.animate({left: -300});
  };
  
  // Return a new view class singleton instance.
  return( new MenuView() );
  
})( jQuery, window.application ));