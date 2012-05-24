$(document).ready(function() {
  // add/remove/sort items in a has_many relationship
  $('.has-many-selector').embededItemsSelector();
});

(function($){
  $.fn.embededItemsSelector = function(options) {

    var populateSelect = function(context) {
      context.select.find('optgroup, option').remove();

			var taked = [];
			for (var bob = 0; bob < context.data.taken_ids.length; bob++){
				taked[bob] = context.data.taken_ids[bob][1];
			}

      if (context.data.new_item) {
        var newItemInfo = context.data.new_item;
        var option = makeOption(newItemInfo.label, newItemInfo.url, true, true);
        context.select.append(option);

        context.select.append(makeOption('-'.repeat(newItemInfo.label.length), '', false, false));
      }

      for (var i = 0; i < context.data.collection.length; i++) {
        var obj = context.data.collection[i];
        if ($.inArray(obj[1], taked) == -1)
        {
          var option = makeOption(obj[0], obj[1], false, false);
          context.select.append(option);
        }
      }

      if (context.select.find('option').size() == 0)
        context.list.find('li.template').hide();
      else
        context.list.find('li.template').show();
    }

    var addId = function(context, id, item_id) {
      context.data.taken_ids.push([id, item_id]);

      populateSelect(context);

      if (context.data.taken_ids.length > 0) {
        context.empty.hide();
        context.list.next('input[type=hidden]').remove();
      }

      if (context.data.taken_ids.length ==  context.data.collection.length)
        context.sep.hide();
    }

    var removeId = function(context, item_id) {
	
      context.data.taken_ids = jQuery.grep(context.data.taken_ids, function(value) {
        return value[1] != item_id;
      });

      populateSelect(context);

      if (context.data.taken_ids.length == 0) {
        context.empty.show();
				// mis dans le controller => si == nil => = "", faisait planter sinon, si plus de jules, me faisiat un get string want hash
        //context.list.after('<input type="hidden" name="' + context.baseInputName + '" value="" />');
      }

      context.sep.show();
    }

    var registerElementEvents = function(context, data, domElement) {
      // edit
      domElement.find('a.edit').click(function(e) {
        var url = context.data.edit_item_url.replace(/\/42\//, '/' + data.id + '/');

        window.location.href = url;

        e.preventDefault(); e.stopPropagation();
      })

      // remove
      domElement.find('a.remove').click(function(e) {
        domElement.remove();

        removeId(context, data.item_id);

        context.list.sortable('refresh');

        e.preventDefault(); e.stopPropagation();
      });
    }

    var registerElementTemplateEvents = function(context, domElement) {
      // bind the "Add field" button
      domElement.find('button').click(function(e) {
        var newElement = {
          item_id: context.select.val(),
          label: context.select.find('option:selected').text()
        };

        if (newElement.item_id == '') return;

        if (newElement.item_id.match(/^http:\/\//)) {
          window.location.href = newElement.item_id;
          e.preventDefault(); e.stopPropagation();
          return;
        }

        addId(context, 0, newElement.item_id);

        addElement(context, newElement, { refreshPosition: true });

        context.list.sortable('refresh');

        e.preventDefault(); e.stopPropagation();
      });
    }

    /* ___ Add an element into the list ___ */
    var addElement = function(context, data, options) {
      options = $.extend({
        'is_template': false,
        'refreshPosition': false
      }, options);

			// we only put index as : context.data.taken_ids.length because the id is already added in the taken_ids array.
      data = $.extend({
        behaviour_flag: function() { return options.is_template ? 'template' : 'added' },
        if_template: function() { return options.is_template },
				index: function() { 
					var indexes = [];
					$('.added').each(function(){
						indexes.push($(this).attr('data-index'));
					});
					if (indexes.length > 0){
						indexes.sort();
						return parseInt(indexes[indexes.length - 1]) + 1;
					}
					else{
						return 0;
					}
			  },
				item_position: function(){
					return context.data.taken_ids.length;
				}
				//index: function() { return context.data.taken_ids.length - 1 }
      }, data);

      var html = Mustache.to_html(context.template, data);

      var domElement = null;

      if (options.is_template) {
        domElement = context.list.append('<li class="sep">&nbsp;</li>').append(html).find('.template');

        context.sep = context.list.find('.sep');

        registerElementTemplateEvents(context, domElement);
      }
      else {
        domElement = context.list.find('> .sep').before(html).prev('li');

        registerElementEvents(context, data, domElement);

        context.error.hide();

        context.list.sortable('refresh');
      }
    }

    return this.each(function() {
      var wrapper = $(this);

      var context = {
        list: wrapper.find('ul'),
        empty: wrapper.find('p:first'),
        template: wrapper.find('script[name=template]').html(),
        baseInputName: wrapper.find('script[name=template]').attr('data-base-input-name'),
        data: eval(wrapper.find('script[name=data]').html()),
        error: wrapper.parent().find('p.inline-errors'),
      };

      // sortable list
			// TODO : CHANGE ORDER ON UPDATE
      context.list.sortable({
        handle: 'span.handle',
        items: 'li:not(.template)',
        axis: 'y', 
				update: function(event, ui){
					context.list.find('li.item').each(function(index){
						$(this).find('input[data-field=position]').val(index);
					});
				}
      });

      // add the template element used to insert the new ones
      addElement(context, null, { is_template: true });

      context.select = wrapper.find('select[name=label]');
      populateSelect(context);

			var offset = $('.added').size();
			
      for (var i = 0; i < context.data.taken_ids.length; i++) {
				
        var data = { id: context.data.taken_ids[i][0], label: null, index: i + offset, item_id: context.data.taken_ids[i][1], item_position: context.data.taken_ids[i][2]};

        for (var j = 0; j < context.data.collection.length; j++) {
          var current = context.data.collection[j];

          if (data.item_id == current[1]) {
            data.label = current[0];
            break;
          }
        }

        addElement(context, data);
      }

      if (context.error.size() > 0)
        context.error.show();
    });
  };
})(jQuery);

