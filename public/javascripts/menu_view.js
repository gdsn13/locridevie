window.application.addView((function( $, application ){
  
  function MenuView(){
		this.view = null;
		this.first_level = null;
		this.menu = null;
		this.menu_title = null;
		this.close_btn = null;
		this.menu_up_to = null;
  };
  
  MenuView.prototype.init = function(){  
		var self = this;
		
		this.view = $('#logo_menu');
		this.first_level = $('#menu > li');
		this.menu = $('#menu');
		this.menu_title = $('#menu_title');
		this.close_btn = $('#close_menu');	

		/* INTERACTION
		----------------------------------------------------------------------------------------*/
		
		this.first_level.hover(function(){
			$(this).find('ul').show();
		}, function(){
			$(this).find('ul').hide();
		});
	
		this.view.hover(function(){
			self.view.animate({opacity: "1"}, 'fast');
		},function(){
			self.view.animate({opacity: "0.3"}, 'fast');
		});
		
		
		// fait apparaitre le menu, le menu ne se range que l'orsqu'on clique sur un élément.
		//OPEN MENU
		this.menu_title.hover(function(){
			//clearTimeout(self.menu_up_to);
			//self.menu_up_to = null;
			self.menu.animate({top: 0}, 'fast');
			//self.close_btn.fadeIn('fast');
			self.view.css({"opacity": "1"});
		});
		
		//CLOSE MENU
		this.menu.on('mouseleave', function(){
			//clearTimeout(self.menu_up_to);
			//self.menu_up_to = null;
			//self.menu_up_to = setTimeout(self.up_menu, 5000);
			self.menu.animate({top: -$(window).height()});
			//self.close_btn.fadeOut('fast');
		})
		
		//CLOSE MENU BTN
		this.close_btn.on('click', function(){
			self.menu.animate()
			$(this).fadeOut('fast');
		})
  };

	MenuView.prototype.up_menu = function( p_menu ){  
		var menu = $('#menu');
		menu.animate({left: -300});
		$('#close_menu').fadeOut('fast');
  };
  
  // Return a new view class singleton instance.
  return( new MenuView() );
  
})( jQuery, window.application ));