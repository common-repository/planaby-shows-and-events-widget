jQuery(document).ready(function($){
    tinymce.create('tinymce.plugins.planMaker', {
        createControl : function(id, controlManager) {
            if (id == 'planMakerButton') {
                var button = controlManager.createButton('mygallery_button', {
                    title : 'Post a Plan', // title of the button
                    image : '../wp-content/plugins/planaby-shows-and-events-widget/resources/PlanabyButton_32.png',  // path to the button's image
                    onclick : function() {
                        jQuery.post('admin-ajax.php',{action:'get_planaby_account'},function(data){
                            var response = jQuery.parseJSON(data);
                            var account = response.planaby_account;
                            $.ajax({
                                type : 'GET',
                                cache: false,
                                url : 'https://ec.planaby.com/woman/ra/Person/queryUsers.json?searchString=' + account,
                                success : function(data){
                                    var authorID = data[0].id;
                                    var dialog = $("<div class='planaby-dialog'></div>");
                                    var autoPost = jQuery('<iframe style="width:364px;height:494px;"></iframe>');
                                    autoPost.attr('src','https://ec.planaby.com/woman/wa/autoPost?authorId=' + authorID);
                                    dialog.append(autoPost);   
                                    dialog.dialog({
                                        width: 390,
                                        height: 520,
                                        resizable : false
                                    });                            
                                },
                                error: function(data){
                                    alert('Invalid Planaby account. Please enter a valid account on the Planaby Settings page.');
                                }
                            }); 
                        });                     
                    }
                });
                return button;
            }
            return null;
        }
    });
    // registers the plugin. DON'T MISS THIS STEP!!!
    tinymce.PluginManager.add('planMaker', tinymce.plugins.planMaker);   
});

