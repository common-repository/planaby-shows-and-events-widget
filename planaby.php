<?php
        /*
        Plugin Name: Planaby
        Description: Planaby Shows and Events Plugin
        Version: 2.2
        Author: Planaby
        Author URI: http://planaby.com/
        */

        global $planaby_table;
        global $planaby_db_version;
        global $wpdb;


        $planaby_table = $wpdb->prefix . 'planaby';
        $planaby_db_version = "1.0";

        register_activation_hook( __FILE__,  'planaby_install' );

        function planaby_install() {
                global $wpdb;
                global $planaby_table;
                global $planaby_db_version;

                if ( $wpdb->get_var( "SHOW TABLES LIKE '$planaby_table'" ) != $planaby_table ) {
                        $sql = "CREATE TABLE $planaby_table (".
                         "id int NOT NULL AUTO_INCREMENT, ".
                         "authorID VARCHAR(20) NOT NULL, ".
                         "UNIQUE KEY id (id) ".
                             ")";

                        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
                        $wpdb->query($sql);

                        add_option( "planaby_db_version", $planaby_db_version );
                }
        }

        function namespace_async_scripts( $tag, $handle ) {
            // Just return the tag normally if this isn't one we want to async
            if ( 'google_map' !== $handle ) {
                return $tag;
            }
            return str_replace( ' src', ' async src', $tag );
        }
        add_filter( 'script_loader_tag', 'namespace_async_scripts', 10, 2 );

        class planabyWidget extends WP_Widget {
                
            function __construct() {
                    parent::__construct( false, $name = 'Planaby Widget' ); 
            }
      
            function widget($args, $instance) {
                extract($args);
                if(isset($instance['title'])){
                    $title = apply_filters('widget_title', $instance['title']);
                }
                if(isset($instance['num_plans'])){
                    $num_plans = apply_filters('num_plans', $instance['num_plans']);
                }
                if(isset($instance['show_address'])){
                    $show_address = apply_filters('show_address', $instance['show_address']) == 'on' ? 1 : 0;
                }
                if(isset($instance['show_city'])){
                    $show_city = apply_filters('show_city', $instance['show_city']) == 'on' ? 1 : 0;
                }
                if(isset($instance['show_venue_name'])){
                    $show_venue_name = apply_filters('show_venue_name', $instance['show_venue_name']) == 'on' ? 1 : 0;
                }
                if(isset($instance['show_dateTime'])){
                    $show_dateTime = apply_filters('show_dateTime', $instance['show_dateTime']) == 'on' ? 1 : 0;
                }
                if(isset($instance['show_planTitle'])){
                    $show_planTitle = apply_filters('show_planTitle', $instance['show_planTitle']) == 'on' ? 1 : 0;
                }
                if(isset($instance['include_facebook'])){
                    $include_facebook = apply_filters('include_facebook', $instance['include_facebook']) == 'off' ? 0 : 1;
                }
                if(isset($instance['include_twitter'])){
                    $include_twitter = apply_filters('include_twitter', $instance['include_twitter']) == 'off' ? 0 : 1;
                }
                if(isset($instance['include_linkedin'])){
                    $include_linkedin = apply_filters('include_linkedin', $instance['include_linkedin']) == 'off' ? 0 : 1;
                }
                if(isset($instance['account'])){
                    $account = apply_filters('account', $instance['account']);
                }
                if(isset($instance['show_thumbnails'])){
                    $show_thumbnails = apply_filters('show_thumbnails', $instance['show_thumbnails']) == 'on' ? 1 : 0;
                }
                if(isset($instance['event_popup'])){
                    $event_popup = apply_filters('event_popup', $instance['event_popup']) == 'on' ? 1 : 0;
                }

                wp_enqueue_script('planaby_widget_js', plugins_url( 'resources/planaby_widget.js' , __FILE__ ));
                wp_enqueue_script('custom_js', plugins_url( 'resources/js/custom.js' , __FILE__ ));

                /* Include Jquery Exist or Not Start Code */
                if ( ! wp_script_is( 'jquery', 'enqueued' )) {
                    wp_enqueue_script('jQuery', plugins_url( 'resources/js/jquery.js' , __FILE__ ));
                }
              /*  if ($instance['include_jquery']) {
                   
                }*/
                /* Include Jquery Exist or Not End Code */

                /*if($instance['include_facebook']) {
                 echo "Facebook Inside";   
                }else{
                    echo "Facebook Outside";
                }*/


                wp_register_script('bootstrap-min-js', plugins_url('resources/js/bootstrap.min.js', __FILE__));
                wp_register_style('bootstrap-css', plugins_url('resources/css/bootstrap.css', __FILE__));
                wp_register_style('style-css', plugins_url('resources/style.css', __FILE__));
                wp_register_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css', __FILE__);
                wp_enqueue_script('google_map', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAZl-cqNJCePpOCKKzIyVNKC06lHiKqv98');
                wp_enqueue_script('bootstrap-min-js');
                wp_enqueue_style('bootstrap-css');
                wp_enqueue_style('style-css');
                wp_enqueue_style('font-awesome');
            ?>

            <?php echo $before_widget; ?>
          
                          <!-- Modal -->
  <div id="eventModal" class="modal" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Event Details</h4>
          <?php //echo $current_url="https://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']; ?>
        <?php //echo get_permalink(); ?>
        <div class="modal-body">
          <div id="event-details">
          </div>
          <div id="map"></div>
          <div id="share-social" class="share_socials" align="center"></div>
        </div>
        
        <div class="modal-footer">          
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
        </div>
      </div>

    </div>
  </div>  

            <div id="widget-area" class="widget-area planaby_widget" role="complementary">
                <?php if (isset($title)) { ?>
                <aside class="widget_text"><div class='plan-list-header'>
                        <h4 class="widget-title"><?php echo $title; ?></h4>
                </div>
                <?php } ?>
                <?php if (isset($account)) { ?>
                <input type='hidden' class='planaby-account' value='<?php echo $account; ?>'/>
                <?php } ?>
                <?php if (isset($show_thumbnails)) { ?>
                <input type='hidden' class='planaby-thumbnails' value='<?php echo $show_thumbnails; ?>'/>
                <?php } ?>
                <?php if (isset($event_popup)) { ?>
                <input type='hidden' class='planaby-event_popup' value='<?php echo $event_popup; ?>'/>
                <?php } ?>
                <?php if (isset($num_plans)) {?>
                <input type='hidden' class='planaby-num_plans' value='<?php echo $num_plans; ?>'/>
                <?php } ?>
                <?php if (isset($show_planTitle)) { ?>
                <input type='hidden' class='planaby-show_planTitle' value='<?php echo $show_planTitle; ?>'/>
                <?php } ?>
                <?php if (isset($include_facebook)) { ?>
                <input type='hidden' class='planaby-include_facebook' value='<?php echo $include_facebook; ?>'/>
                <?php } ?>
                <?php if (isset($include_twitter)) { ?>
                <input type='hidden' class='planaby-include_twitter' value='<?php echo $include_twitter; ?>'/>
                <?php } ?>
                <?php if (isset($include_linkedin)) { ?>
                <input type='hidden' class='planaby-include_linkedin' value='<?php echo $include_linkedin; ?>'/>
                <?php } ?>
                <?php if (isset($show_dateTime)) { ?>
                <input type='hidden' class='planaby-show_dateTime' value='<?php echo $show_dateTime; ?>'/>
                <?php } ?>
                <?php if (isset($show_venue_name)) { ?>
                <input type='hidden' class='planaby-show_venue_name' value='<?php echo $show_venue_name; ?>'/>
                <?php } ?>
                <?php if (isset($show_address)) { ?>
                <input type='hidden' class='planaby-show_address' value='<?php echo $show_address; ?>'/>
                <?php } ?>
                <?php if (isset($show_city)) { ?>
                <input type='hidden' class='planaby-show_city' value='<?php echo $show_city; ?>'/>
                <?php } ?>
                <ul class='plan-list'>

                </ul>
                <div class='plan-list-footer'>
                </div>
            	</aside>    
            </div>
            

            <?php echo $after_widget;

            }

            function update( $new_instance, $old_instance ) {
                return $new_instance;
            }

            function form( $instance ) {
                /* trick to detect first widget load, needed for checkboxes default values */
                if(!count($instance)){
                    $defaults = array(
                        'num_plans' => 10,
                        // comment a row below to disable a checkbox, changing the value to false will not actually disable it
                        'show_address' => true,
                        'show_city' => true,
                        'show_venue_name' => true,
                        'show_dateTime' => true,
                        'show_planTitle' => true,
                        'include_facebook' => true,
                        'include_twitter' => true,
                        'include_linkedin' => true,
                        // 'show_thumbnails' => true,
                        'event_popup' => true,
                    );
                    $instance = array_merge($defaults, $instance);
                }

                if(isset($instance['title'])){
                    $title = esc_attr($instance['title']);
                }
                if(isset($instance['account'])){
                    $account = esc_attr($instance['account']);
                }
                if(isset($instance['num_plans'])){
                    $num_plans = esc_attr($instance['num_plans']);
                }else{
                    $num_plan = 10;
                }
                if(isset($instance['show_address'])){
                    $show_address = esc_attr($instance['show_address']);
                }
                if(isset($instance['show_city'])){
                    $show_city = esc_attr($instance['show_city']);
                }
                if(isset($instance['show_venue_name'])){
                    $show_venue_name = esc_attr($instance['show_venue_name']);
                }
                if(isset($instance['show_dateTime'])){
                    $show_dateTime = esc_attr($instance['show_dateTime']);
                }
                if(isset($instance['show_planTitle'])){
                    $show_planTitle = esc_attr($instance['show_planTitle']);
                }
                if(isset($instance['include_facebook'])){
                    $include_facebook = esc_attr($instance['include_facebook']);
                }
                if(isset($instance['include_twitter'])){
                    $include_twitter = esc_attr($instance['include_twitter']);
                }
                if(isset($instance['include_linkedin'])){
                    $include_linkedin = esc_attr($instance['include_linkedin']);
                }
                if(isset($instance['show_thumbnails'])){
                    $show_thumbnails = esc_attr($instance['show_thumbnails']);
                }
                if(isset($instance['event_popup'])){
                    $event_popup = esc_attr($instance['event_popup']);
                }
            ?>
            <p>
                <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e( 'Optional Title:' ); ?></label>

                <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php if(isset($title)) { echo $title; } ?>" />

                <label for="<?php echo $this->get_field_id('account'); ?>"><?php _e( 'Planaby Username:' ); ?></label>                
                <input class="widefat" id="<?php echo $this->get_field_id( 'account' ); ?>" name="<?php echo $this->get_field_name( 'account' ); ?>" type="text" value="<?php if(isset($account)) { echo $account; } ?>" />
                <script type="text/javascript">jQuery(function($){$('#<?php echo $this->get_field_id('account'); ?>').not('#widget-planabywidget-__i__-account.widefat').userSearchWidget();});</script>

                <label for="<?php echo $this->get_field_id('num_plans'); ?>"><?php _e( 'Limit Plan List To:' ); ?></label>
                <input id="<?php echo $this->get_field_id('num_plans'); ?>" name="<?php echo $this->get_field_name('num_plans'); ?>" type="number" style='width:45px;' value="<?php echo $num_plans; ?>" />
                <hr/>
                <table>
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('show_thumbnails'); ?>"><?php _e( 'Display Profile Photo:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('show_thumbnails'); ?>' <?php if (isset($show_thumbnails)){echo 'checked';} ?> name='<?php echo $this->get_field_name('show_thumbnails'); ?>'/></td>
                </tr>
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('show_address'); ?>"><?php _e( 'Display Address:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('show_address'); ?>' <?php if (isset($show_address)){echo 'checked';} ?> name='<?php echo $this->get_field_name('show_address'); ?>'/></td>
                </tr>
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('show_city'); ?>"><?php _e( 'Display City:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('show_city'); ?>' <?php if (isset($show_city)){echo 'checked';} ?> name='<?php echo $this->get_field_name('show_city'); ?>'/></td>                
                </tr>
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('show_venue_name'); ?>"><?php _e( 'Display Venue Name:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('show_venue_name'); ?>' <?php if (isset($show_venue_name)){echo 'checked';} ?> name='<?php echo $this->get_field_name('show_venue_name'); ?>'/></td>                
                </tr>     
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('show_dateTime'); ?>"><?php _e( 'Display Date/Time:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('show_dateTime'); ?>' <?php if (isset($show_dateTime)){echo 'checked';} ?> name='<?php echo $this->get_field_name('show_dateTime'); ?>'/></td>                
                </tr>  
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('show_planTitle'); ?>"><?php _e( 'Display Plan Title:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('show_planTitle'); ?>' <?php if (isset($show_planTitle)){echo 'checked';} ?> name='<?php echo $this->get_field_name('show_planTitle'); ?>'/></td>                 
                </tr> 
                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('event_popup'); ?>"><?php _e( 'Allow Details Popup:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('event_popup'); ?>' <?php if (isset($event_popup)){echo 'checked';} ?> name='<?php echo $this->get_field_name('event_popup'); ?>'/></td>                 
                </tr>

                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('include_facebook'); ?>"><?php _e( 'Include Facebook:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('include_facebook'); ?>' <?php if (isset($include_facebook)){echo 'checked';} ?> name='<?php echo $this->get_field_name('include_facebook'); ?>'/></td>                
                </tr>

                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('include_twitter'); ?>"><?php _e( 'Include Twitter:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('include_twitter'); ?>' <?php if (isset($include_twitter)){echo 'checked';} ?> name='<?php echo $this->get_field_name('include_twitter'); ?>'/></td>                
                </tr>

                <tr>
                <th style='text-align:left;'><label for="<?php echo $this->get_field_id('include_linkedin'); ?>"><?php _e( 'Include Linkedin:' ); ?></label></th>
                <td><input type='checkbox' id='<?php echo $this->get_field_id('include_linkedin'); ?>' <?php if (isset($include_linkedin)){echo 'checked';} ?> name='<?php echo $this->get_field_name('include_linkedin'); ?>'/></td>                
                </tr>

            </table>
        </p>
        <?php
        }
    }

    add_action( 'widgets_init', 'MyWidgetInit' );

    function MyWidgetInit() {
            register_widget( 'planabyWidget' );
    }

        if ( ! defined( 'ABSPATH' ) )
    die("Can't load this file directly");
       
    class planMaker{
        
        function __construct() {
            add_action( 'admin_init', array( $this, 'action_admin_init' ) );
        }
         
        function action_admin_init() {
            
            // wp_register_script('jquery-ui-js', plugins_url('resources/jqueryui.js', __FILE__));    
            // wp_register_style('planaby-admin-ui-css', plugins_url('resources/jqueryui.css', __FILE__));
            
            // wp_enqueue_script('jquery-ui-js');
            // wp_enqueue_style('planaby-admin-ui-css');

            if ( current_user_can( 'edit_posts' ) && current_user_can( 'edit_pages' ) ) {
                add_filter( 'mce_buttons', array( $this, 'filter_mce_button' ) );
                add_filter( 'mce_external_plugins', array( $this, 'filter_mce_plugin' ) );
            }
        }
         
        function filter_mce_button( $buttons ) {
            array_push( $buttons, '|', 'planMakerButton' );
            return $buttons;
        }
         
        function filter_mce_plugin( $plugins ) {
            $plugins['planMaker'] = plugin_dir_url( __FILE__ ) . '/resources/planmaker.js';
            return $plugins;
        } 
    }
 
    class options_page {
        
        function __construct() {
            add_action('admin_menu', array(&$this, 'admin_menu'));
        }
        function admin_menu () {
            add_options_page('Planaby Settings','Planaby Settings','manage_options','planaby',array($this, 'settings_page'));
        }
        function  settings_page () {
        
        add_action('admin_init', 'planaby_get_scripts');

        function planaby_get_scripts(){
            //wp_enqueue_script('jquery');
            //wp_enqueue_script('jquery-ui-js', plugins_url('resources/jqueryui.js', __FILE__));    
            //wp_enqueue_style('planaby-admin-ui-css', plugins_url('resources/jqueryui.css', __FILE__));
        }

        if (isset($_POST['update_settings']) == 'Y'){
            $planaby_account = esc_attr($_POST["planaby_account"]);   
            update_option("planaby_account", $planaby_account);     
        }
        
        ?> 
        <div class='wrap'>
            <img src='../wp-content/plugins/planaby-shows-and-events-widget/resources/PlanabyButton_32.png' class='planaby-settings-icon icon32'>
            <h2>Planaby Settings</h2>

            <h3> Planaby Shows and Events Widget</h3>
            <p> Post and list your upcoming events easily using Planaby. 

            <p> For step-by-step installation instructions, visit:  <a href='https://www.planaby.com/for-plugin-users/'>https://www.planaby.com/for-plugin-users/</a> ‎
 
            <h3>Sidebar Settings</h3>
            <p>Access the Appearance -> Widgets section to drag and drop Planaby sidebar widgets into place. Each sidebar widget can have its own title, options and associated Planaby account.

            <h3>Website Tools</h3>

            <p>To create an account on Planaby, visit <a href='http://planaby.com/'>http://planaby.com/</a>
            <p>
            <p><i>Thank you for promoting your events using Planaby.</i>
        </div>
        <script>
        $(document).ready(function() {
            //jquery
            $(location).attr('href');

            //pure javascript
            var pathname = window.location.pathname;
            
            // to show it in an alert window
            // alert(window.location);
        });
        </script>
        <?php          
        }
    }

    new options_page;

    register_activation_hook(__FILE__, 'my_plugin_activate');
    add_action('admin_init', 'my_plugin_redirect');

    function my_plugin_activate() {
        add_option('my_plugin_do_activation_redirect', true);
    }

    function my_plugin_redirect() {
        if (get_option('my_plugin_do_activation_redirect', false)) {
            delete_option('my_plugin_do_activation_redirect');
            wp_redirect('options-general.php?page=planaby');
        }
    }

    add_action("wp_ajax_get_planaby_account", "get_planaby_account");
    add_action("wp_ajax_nopriv_get_planaby_account", "get_planaby_account");

    function get_planaby_account(){
        $response = array();
        $response['planaby_account'] = get_option('planaby_account');
        echo json_encode($response);
        die();
    }

    add_shortcode('planaby', 'planaby_from_shortcode');
    add_shortcode('Planaby', 'planaby_from_shortcode');

    function planaby_from_shortcode($atts = array()){
        extract(shortcode_atts(array(  
            "title" => 'My Plans',
            "maxplans" => 8,
            "account" => get_option('planaby_account')  
        ), $atts));
        $plan = new PlanabyWidget;
        //print_r($plan);
        echo $plan->widget(array(),array('title' => $title, 
                                         'account' => $account,
                                         'num_plans' => $maxplans,
                                         'show_address' => 'on',
                                         'show_city' => 'on',
                                         'show_venue_name' => 'on',
                                         'show_planTitle' => 'on',
                                         'show_dateTime' => 'on',
                                         'show_thumbnails' => 'on',
                                         'event_popup' => 'on',
                                         'include_facebook' => 'off',
                                         'include_twitter' => 'off',
                                         'include_linkedin' => 'off'));
    }

    $planMaker = new PlanMaker();


    /* Adds the search and autocomplete feature to the username input on the Widgets page */
    function planaby_search_widget_admin_scripts($hook) {

        if ( $hook === 'widgets.php' || $hook === 'post.php' ) {
            
            wp_enqueue_style('planaby_search_widget_css', plugins_url( 'resources/css/searchWidget.css' , __FILE__ ), array());

            wp_enqueue_script('jquery');
            wp_enqueue_script('jquery-ui-autocomplete');
            wp_enqueue_script('planaby_search_widget_js', plugins_url( 'resources/js/searchWidget.js' , __FILE__ ), array('jquery','jquery-ui-autocomplete'));

        }
    }
    add_action( 'admin_enqueue_scripts', 'planaby_search_widget_admin_scripts' );

    function planaby_search_widget_admin_footer() {

        echo '<div id="planaby-admin-search-results-container"></div>';
    }
    add_action( 'admin_footer', 'planaby_search_widget_admin_footer' );

function planaby_adding_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('planaby_widget_js', plugins_url('resources/planaby_widget.js', __FILE__), array('jquery'));
    wp_enqueue_script('custom_js', plugins_url('resources/js/custom.js', __FILE__));

    /* Include Jquery Exist or Not Start Code */
    /*if (!wp_script_is('jquery', 'enqueued')) {
        wp_enqueue_script('jQuery', plugins_url('resources/js/jquery.js', __FILE__));
    }*/
    /*  if ($instance['include_jquery']) {
         
      }*/
    /* Include Jquery Exist or Not End Code */

    /*if($instance['include_facebook']) {
     echo "Facebook Inside";   
    }else{
        echo "Facebook Outside";
    }*/


    wp_register_script('bootstrap-min-js', plugins_url('resources/js/bootstrap.min.js', __FILE__));
    wp_register_style('bootstrap-css', plugins_url('resources/css/bootstrap.css', __FILE__));
    wp_register_style('style-css', plugins_url('resources/style.css', __FILE__));
    wp_register_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css', __FILE__);
    wp_enqueue_script('google_map', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAZl-cqNJCePpOCKKzIyVNKC06lHiKqv98');
    wp_enqueue_script('bootstrap-min-js');
    wp_enqueue_style('bootstrap-css');
    wp_enqueue_style('style-css');
    wp_enqueue_style('font-awesome');
}

add_action('wp_enqueue_scripts', 'planaby_adding_scripts');