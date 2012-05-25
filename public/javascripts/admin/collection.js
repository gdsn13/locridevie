$(document).ready(function() {
  
  // Manage Uploadify
	var field_name = $('#uploadify').attr('field_name');
  $('#uploadify').uploadify({
      swf :           '/uploadify/uploadify.swf',
      checkExisting : false,
      uploader :      $('#uploadify').attr('rel'),
      fileObjName :   'content['+field_name+']',
      fileTypeDesc :  'All Images Files',
			fileTypeExts :  '*.png;*.jpg;*.gif',
      cancelImage :     '/uploadify/uploadify-cancel.png',
      multi :         true,
      postData :      {},
      auto :          true,
      fileSizeLimit   : 10000000000,
      onSelect :      function(file) {
        var data = {
          utf8 : "✓"
        }
        $('#uploadify').uploadifySettings('postData', data);
      },
      onUploadSuccess : function(file,data,response) {
        if (response) {
          // Getting the Context of the HasMany selector
          var wrapper = $('#uploadify').parents('.has-many-selector:first');
          var context = {
            list: wrapper.find('ul'),
            empty: wrapper.find('p:first'),
            template: wrapper.find('script[name=template]').html(),
            baseInputName: wrapper.find('script[name=template]').attr('data-base-input-name'),
            data: eval(wrapper.find('script[name=data]').html()),
            error: wrapper.parent().find('p.inline-errors')
          };
          context.list.sortable({
            handle: 'span.handle',
            items: 'li:not(.template)',
            axis: 'y'
          });
          // Creating the new element
          var doto = eval('(' + data + ')');
          var newElement = {
            id: doto["_id"],
            label: doto[field_name+'_filename'],
            thumb: "/contents/content_instance/" + doto["_id"] + "/thumb_"+doto[field_name+'_filename']
          };
          // Adding it in a hard way ...
          addElementInHasManyList(context, newElement);
        }
      },
      onUploadError : function(file,errorCode,errorMsg) {
        console.log('Back back with error oh shit');
        console.log(errorMsg);
        console.log(errorCode);
      }
  });
  
});

function addElementInHasManyList(context, element) {

          /// Dirty Hack
          var addId = function(context, id) {
      context.data.taken_ids.push(id);

      populateSelect(context);

      if (context.data.taken_ids.length > 0) {
        context.empty.hide();
        context.list.next('input[type=hidden]').remove();
      }

      if (context.data.taken_ids.length ==  context.data.collection.length)
        context.sep.hide();
    }

    var removeId = function(context, id) {
      context.data.taken_ids = jQuery.grep(context.data.taken_ids, function(value) {
        return value != id;
      });

      //populateSelect(context);

      if (context.data.taken_ids.length == 0) {
        context.empty.show();
        context.list.after('<input type="hidden" name="' + context.baseInputName + '" value="" />');
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

        removeId(context, data.id);

        context.list.sortable('refresh');

        e.preventDefault(); e.stopPropagation();
      });
    }

    var registerElementTemplateEvents = function(context, domElement) {
      // bind the "Add field" button
      domElement.find('button').click(function(e) {
        var newElement = {
          id: context.select.val(),
          label: context.select.find('option:selected').text()
        };

        if (newElement.id == '') return;

        if (newElement.id.match(/^http:\/\//)) {
          window.location.href = newElement.id;
          e.preventDefault(); e.stopPropagation();
          return;
        }

        addId(context, newElement.id);

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

      data = $.extend({
        behaviour_flag: function() { return options.is_template ? 'template' : 'added' },
        base_name: function() { return options.is_template ? '' : context.baseInputName },
        if_template: function() { return options.is_template }
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
    
    addElement(context, element);
    
}
