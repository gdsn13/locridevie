window.application.addView((function( $, application ){
  
  function MenuView(){
		this.menu = null;
		this.model = null;
		this.current_sub_menu_displayed = null;
  };
  
  MenuView.prototype.init = function(){  
		var self = this;
		
		self.menu = $('#navigation');
		self.model = application.getModel( "Model" );
		self.current_sub_menu_displayed = self.menu.find('li:first ul');
		
		$('#navigation > li').hover(function(){
			//hover
			if ($(this).find("ul:first").attr('id') != self.current_sub_menu_displayed.attr('id')){
				$(this).stop().find("ul").fadeIn('fast');
				self.current_sub_menu_displayed.stop().fadeOut('fast');
			}
		}, function(){
			//out
			$(this).stop().find("ul").fadeOut('fast');
			self.current_sub_menu_displayed.stop().fadeIn('fast');
		});
		
		self.menu.find('li ul li a').click(function(){
			$('.on').removeClass('on');
			$(this).addClass('on');
			$(this).parent().parent().parent().find('.menu_title').addClass('on');
		});
		
  };  

	MenuView.prototype.change_url = function(p_location){		
		if (p_location != ""){
			var current = this.menu.find('li ul li a[href*="' + p_location + '"]');
			current.addClass('on');
			current.parent().parent().parent().find('.menu_title').addClass('on');
			this.current_sub_menu_displayed = current.parent().parent();
			this.current_sub_menu_displayed.css('display', 'block');
		}
	};

  // Return a new view class singleton instance.
  return( new MenuView() );
  
})( jQuery, window.application ));