<?php
/**
 * Plugin Name: Libby for Books, Movies and More
 * Plugin URI: https://github.com/stirlingtechnologies/libby-library
 * Description: Create interactive lists and carousels for books, movies and more for your online catalog.
 * Author: Brian John Hanna, Stirling Technologies
 * Author URI: https://meetlibby.org
 * Version: 2.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * GitHub Plugin URI: brianjohnhanna/wp-gutenberg-post-carousel
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
