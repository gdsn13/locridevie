window.application.addView((function( $, application ){
  
  function MenuView(){
		this.menu = null;
		this.model = null;
		this.current_sub_menu_displayed = null;
		this.current_location = null;
  };
  
  MenuView.prototype.init = function(){  
		var self = this;
		
		self.menu = $('#navigation');
		self.model = application.getModel( "Model" );
		//self.current_sub_menu_displayed = self.menu.find('li:first ul');
		
		$('#navigation > li').hover(function(){
			//hover			
			
			//if (self.current_sub_menu_displayed != null) => cas de la home page, il n'y a pas de self.
			
			if (self.current_sub_menu_displayed != null){
				if ($(this).find("ul:first").attr('id') != self.current_sub_menu_displayed.attr('id')){
					$(this).stop().find("ul").fadeIn('fast');
					self.current_sub_menu_displayed.stop(true, true).fadeOut('fast');
				}
			}else{
				$(this).stop().find("ul").fadeIn('fast');
				//self.current_sub_menu_displayed.stop(true, true).fadeOut('fast');
			}
			
		}, function(){
			//out
			$(this).stop().find("ul").fadeOut('fast');
			if (self.current_sub_menu_displayed != null){
				self.current_sub_menu_displayed.fadeIn('fast');
			}
		});
		
		self.menu.find('li ul li a').click(function(){
			$('.on').removeClass('on');
			$(this).addClass('on');
			$(this).parent().parent().parent().find('.menu_title').addClass('on');
		});
		
  };  

	MenuView.prototype.change_url = function(p_location){
		this.current_location = p_location;
		
		if (p_location != ""){
			if (p_location.indexOf("spectacle/", 0) >= 0){
				//on est sur une page spectacle, on affiche saison
				var current = this.menu.find('li ul li a[href*="/#/spectacles/programmation"]');
				current.addClass('on');
				current.parent().parent().parent().find('.menu_title').addClass('on');
				this.current_sub_menu_displayed = current.parent().parent();
				this.current_sub_menu_displayed.css('display', 'block');
			}else{
				var current = this.menu.find('li ul li a[href*="' + p_location + '"]');
				current.addClass('on');
				current.parent().parent().parent().find('.menu_title').addClass('on');
				this.current_sub_menu_displayed = current.parent().parent();
				this.current_sub_menu_displayed.css('display', 'block');
			}
		}
	};

  // Return a new view class singleton instance.
  return( new MenuView() );
  
})( jQuery, window.application ));