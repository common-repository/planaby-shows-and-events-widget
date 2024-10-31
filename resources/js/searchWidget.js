(function($){

	/* the search widget */
	$.widget( "searchWidgets.userSearchWidget", {

	    _create: function() {

	    	this.element
	    		.addClass('planaby-admin-search-input')
	    		.attr('spellcheck','false');

	    	this._createAutocomplete();
	    	this._createToggleButton();

	    },

	    _createAutocomplete: function(){

	    	this.cache = {};

	    	this.selectedItem = null;

	    	var parent = this;

	    	this.element.autocomplete({
		        minLength: 0,
		        classes: {

		            "ui-autocomplete": "planaby-admin-search-results"

		        },
		        appendTo: '#planaby-admin-search-results-container',
		        source: function(request, response) {

		            if (request.term in parent.cache) {

		                response(parent.cache[request.term]);

		            } else {

		                $.ajax('https://ec.planaby.com/woman/ra/Person/queryUsers.json?searchString=' + request.term)
		                    .done(function(data, textStatus, jqXHR) {
		                        parent.cache[request.term] = data.slice(0,5);
		                        response(parent.cache[request.term]);
		                    })
		                    .fail(function(jqXHR, textStatus, errorThrown) {
		                        response([]);
		                    })

		            }

		        },

		        response: function(event, ui) {

		        },

		        select: function(event, ui) {
		            parent.element.val(ui.item.username);
		            parent.selectedItem = ui.item;
		            parent.element.blur();
		            return false;
		        },

		        focus: function(event, ui) {
		            parent.element.val(ui.item.username);
		            return false;
		        },

		        change: function(event, ui) {

		            if (parent.selectedItem) {
		                parent.element.val(parent.selectedItem.username)
		            } else {

		            }
		        },

		        close: function(event, ui) {
		            parent.element.removeClass('planaby-admin-search-results-opened');
		        },

		        create: function(event, ui) {

		        	if(parent.element.val()){

		        		parent.selectedItem = {username: parent.element.val()};

		        	}else{

		        		$.ajax('https://ec.planaby.com/woman/ra/Person/queryUsers.json')
		        		    .done(function(data, textStatus, jqXHR) {
		        		        if (!parent.element.val()) {
		        		            parent.element.val(data[0].username);
		        		            parent.selectedItem = data[0];
		        		            parent.cache[''] = data.slice(0,5);
		        		        } else {

		        		        }
		        		    });

		        	}
		            
		        },

		        open: function(event, ui) {
		            parent.element.addClass('planaby-admin-search-results-opened');
		        },

		        search: function(event, ui) {

		        }
		    })
		    .data("uiAutocomplete")._renderItem = function(ul, item) {

		    	var detailsArray = [];

		    	if(item.name) detailsArray.push(item.name);

		    	if(item.website) detailsArray.push(item.website);

		    	if(item.location) detailsArray.push(item.location);

		    	var details = detailsArray.join(' ');

		        return $("<li>")
		            .append(
		                $("<div>")
		                .append('<div class="planaby-admin-search-result-username">' + item.username + '</div>' +
		                    '<div class="planaby-admin-search-result-details">' + details + '</div>')
		            )
		            .appendTo(ul);
		    };

		    this.element.on('focus',function(e){

		    	e.target.select();

		    });

	    },

	    _createToggleButton: function(){
	    	
	    	this.toggleButton = $('<div class="planaby-admin-search-input-toggle"></div>')
	    		.insertAfter(this.element);

	    	this.wasOpened = false;

	    	var parent = this;

	    	this.toggleButton
	    	    .on("mousedown", function() {
	    	        parent.wasOpened = parent.element.hasClass('planaby-admin-search-results-opened');
	    	    })
	    	    .on("click", function() {
	    	        if (!parent.wasOpened) {
	    	            parent.element.focus();
	    	            parent.element.autocomplete('search');
	    	        }
	    	    });

	    }

	});

	/* Listen for when a widget is added and initialize the search widget */
	$(document).on('widget-added widget-updated', function(event, widget){

	    $(widget)
	    	.find('[id^="widget-planabywidget-"][id$="-account"]')
	    	.userSearchWidget();

	});

	/* Initialize the plugin the the already present widgets */
	$(function(){

		$('[id^="widget-planabywidget-"][id$="-account"]').not('#widget-planabywidget-__i__-account.widefat').userSearchWidget();

	});

})(jQuery);