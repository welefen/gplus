<?php
function gplus_widgets_init() {
	register_sidebar(array(
		'name' => __('Primary Widget Area', 'gplus'),
		'id' => 'primary-widget-area',
		'description' => __('The primary widget area', 'gplus'),
		'before_widget' => '<section class="widget">',
		'after_widget' => '</section>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	));
}
//add recent comments widget
function gplus_add_recent_comments(){
	include_once "widget/recent_comments.php";
	register_widget("Gplus_Recent_Comments_Widget");
}
add_action( 'widgets_init', 'gplus_widgets_init' );
add_action( 'widgets_init', 'gplus_add_recent_comments' );


$GLOBALS['comments_li_class'] = 'odd';

function gplus_comment($comment, $args, $depth) {
   $GLOBALS['comment'] = $comment;
   $options = gplus_get_options();
?>
<li class="clearfix <?php echo $GLOBALS['comments_li_class'];?>">
	<a class=portrait name="comment-<?php comment_ID();?>"><?php echo get_avatar($comment,$size='48',$default='' ); ?></a><span style="display:block;"><?php comment_author_link() ?>&nbsp;&nbsp;
	<?php printf(__('%1$s at %2$s', 'gplus'), get_comment_date(),  get_comment_time()) ?></a>
	<?php if( $options['show_reply']):?>
		<a onclick="replyComment(<?php comment_ID();?>, '<?php echo get_comment_author();?>')" href="#commentForm">&nbsp;<?php echo __("Reply", "gplus"); ?></a>
	<?php endif;?>
	<?php edit_comment_link(__('[Edit]'),' ','') ?></span><?php if ($comment->comment_approved == '0') : ?>
	<em class=approved>
	<?php _e('Your comment is awaiting moderation.', 'gplus') ?></em><?php endif; ?><p id="commentText<?php comment_ID();?>"><?php echo nl2br(get_comment_text()); ?></p><?php 
		if ($GLOBALS['comments_li_class'] === 'odd'){
			$GLOBALS['comments_li_class'] = 'even';
		}else{
			$GLOBALS['comments_li_class'] = 'odd';
		}
	?><?php }

/* wp_list_comments()->pings callback */
function gplus_custom_pings($comment, $args, $depth) {
    $GLOBALS['comment'] = $comment;
    if('pingback' == get_comment_type()) $pingtype = 'Pingback';
    else $pingtype = 'Trackback';
?> <li> <?php comment_author_link(); ?> - <?php echo $pingtype; ?> on <?php echo mysql2date('Y/m/d/ H:i', $comment->comment_date); ?><?php }





if (function_exists('wp_nav_menu')) {
	register_nav_menus(array('primary' => __('Primary Navigation', 'gplus')));
}


load_theme_textdomain('gplus', get_template_directory() . '/lang/');


$gplus_items = array (
	array(
		'id' => 'logo_url',
		'name' => __('logo image URL', 'gplus'),
		'desc' => __('logo image url.(with http://), height is 28px, max width is 140px', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => '404img_url',
		'name' => __('404 image URL', 'gplus'),
		'desc' => __('404 page image URL. max width is 700px', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => 'rss_url',
		'name' => __('rss URL', 'gplus'),
		'desc' => __('Custom rss URL', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => 'header_not_fixed',
		'name' => __('header not fixed', 'gplus'),
		'desc' => __('header not fixed?', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'show_author',
		'name' => __('show author', 'gplus'),
		'desc' => __('display author in article list?', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'show_reply',
		'name' => __('show reply', 'gplus'),
		'desc' => __('show reply button in comment list', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'use_opti_syntaxhighlighter',
		'name' => __('use optimize syntaxhighlighter', 'gplus'),
		'desc' => __('use optimize syntaxhighlighter.support CSS, Javascript, Java, Php, Python, Sql, Xml, Html. enable this option muse be disabled wp-syntaxhighlighter plugin', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'use_vender_comment',
		'name' => __('use vender comment', 'gplus'),
		'desc' => __('use vender comment replace default comment, such as youyan', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'js_framework',
		'name' => __('js framework', 'gplus'),
		'desc' => __('js framework, jquery or qwrap or kissy', 'gplus'),
		'type' => 'radio'
	),
	array(
		'id' => 'show_fx',
		'name' => __('show fx?', 'gplus'),
		'desc' => __('animate for show content, only in jquery ', 'gplus'),
		'type' => 'radio'
	),
	array(
		'id' => 'not_use_ajax',
		'name' => __('not use ajax', 'gplus'),
		'desc' => __('if not use ajax, cache,storage and animate options is not used', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'cache_time',
		'name' => __('cache time', 'gplus'),
		'desc' => __('cache time. default is 1 day. 24 *3600 seconds. 0 is not cache', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => 'not_use_storage',
		'name' => __('not use storage?', 'gplus'),
		'desc' => __('use storage for cache content for next request', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'excerpt_check',
		'name' => __('Home Summary?', 'gplus'),
		'desc' => __('check this then home page will be display post Summary', 'gplus'),
		'type' => 'checkbox',
	),
	array(
		'id' => 'excerpt_words',
		'name' => __('Summary words', 'gplus'),
		'desc' => __('if you check the Home Summary that you can change then Summary words', 'gplus'),
		'type' => 'text',
		'default_value' => "200"
	),
	array(
		'id' => 'callback_function',
		'name' => __('callback function', 'gplus'),
		'desc' => __('callback function. such as SyntaxHighlighter.highlight()', 'gplus'),
		'type' => 'textarea',
		'default_value' => ""
	),
	array(
		'id' => 'tongji_js_value',
		'name' => __('analytic js content', 'gplus'),
		'desc' => __('analytic js content. such as baidu tongji, google analytics', 'gplus'),
		'type' => 'textarea',
		'default_value' => ""
	),
	array(
		'id' => 'comment_se_key',
		'name' => __('Comment Security Key', 'gplus'),
		'desc' => __('Comment Security Key', 'gplus'),
		'type' => 'text'
	),
);
add_action( 'admin_init', 'gplus_theme_options_init' );
add_action( 'admin_menu', 'gplus_theme_options_add_page' );
function gplus_theme_options_init(){
	register_setting( 'gplus_options', 'gplus_options', 'gplus_options_validate' );
}
function gplus_default_options() {
	global $gplus_items;
	$options = get_option( 'gplus_options' );
	foreach ( $gplus_items as $item ) {
		if ( ! isset( $options[$item['id']] ) ) {
			$options[$item['id']] = '';
		}
	}
	update_option( 'gplus_options', $options );
}
add_action( 'init', 'gplus_default_options' );

function gplus_comment_mail_notify($comment_id) {
	$comment = get_comment($comment_id);
	$parent_id = $comment->comment_parent ? $comment->comment_parent : '';
	$spam_confirmed = $comment->comment_approved;
	if (($parent_id != '') && ($spam_confirmed != 'spam')) {
		$wp_email = 'no-reply@' . preg_replace('#^www\.#', '', strtolower($_SERVER['SERVER_NAME']));//发件人e-mail地址
	    $to = trim(get_comment($parent_id)->comment_author_email);
	    $subject = '您在['.get_option("blogname").']的留言有了回复';
	    $message = '
			<div style="background-color:#eef2fa; border:1px solid #d8e3e8; color:#111; padding:0 15px; -moz-border-radius:5px; -webkit-border-radius:5px; -khtml-border-radius:5px;">
			<p>'.trim(get_comment($parent_id)->comment_author).', 您好!</p>
			<p>这是您在《'.get_the_title($comment->comment_post_ID).'》中的留言:<br />'
			.trim(get_comment($parent_id)->comment_content).'</p>
			<p>以下是'.trim($comment->comment_author).' 给您的回复:<br />'
			.trim($comment->comment_content).'<br /></p>
			<p>您可以<a href="' . htmlspecialchars(get_comment_link($parent_id)) . '">点击这里查看回复的完整内容.</a></p>
			<p>欢迎再度光临 <a href="' . get_option('home') . '">' . get_option('blogname') . '</a></p>
			<p>(注:此邮件由系统自动发出,请勿回复!)</p>
			</div>';
	    $from = "From: \"" . get_option('blogname') . "\" <$wp_email>";
	    $headers = "$from\nContent-Type: text/html; charset=" . get_option('blog_charset') . "\n";
	    wp_mail( $to, $subject, $message, $headers );
	    //echo 'mail to ', $to, '<br/> ' , $subject, $message; // for testing
	}
}
add_action('comment_post', 'gplus_comment_mail_notify');


function gplus_theme_options_add_page() {
	add_theme_page( __( 'Theme Options' , 'gplus'), 
					__( 'Theme Options' , 'gplus'), 
					'edit_theme_options', 
					'theme_options', 
					'gplus_theme_options_do_page' );
}

function gplus_theme_options_do_page() {
	global $gplus_items;
	if (gplus_is_post()){
		echo 111;
	}
	if ( ! isset( $_REQUEST['updated'] ) )
		$_REQUEST['updated'] = false;
?><div class=wrap><?php screen_icon(); echo "<h2>" . sprintf( __( '%1$s Theme Options' , 'gplus'), get_current_theme() )	 . "</h2>"; ?><?php if ( false !== $_REQUEST['updated'] ) : ?><div class="updated fade"><p><strong><?php _e( 'Options saved' , 'gplus'); ?></strong></p></div><?php endif; ?><form method=post action=options.php><?php settings_fields( 'gplus_options' ); ?><?php $options = get_option( 'gplus_options' ); ?><table class=form-table><?php foreach ($gplus_items as $item) { ?><tr valign=top style="margin:0 10px;border-bottom:1px solid #ddd;"><th scope=row><?php echo $item['name']; ?></th><td><?php if ($item['type'] == 'radio'):?><?php if ($item['id'] == 'js_framework'):?><input name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value="" <?php if (!$options[$item['id']]):?> checked <?php endif;?>> jquery&nbsp;&nbsp;<input name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value=qwrap <?php if ($options[$item['id']] == 'qwrap'):?> checked <?php endif;?>> qwrap&nbsp;&nbsp;<input name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value=kissy <?php if ($options[$item['id']] == 'kissy'):?> checked <?php endif;?>> kissy<?php else:?><input name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value="" <?php if (!$options[$item['id']]):?> checked <?php endif;?>> none&nbsp;&nbsp;<input name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value=fade <?php if ($options[$item['id']] == 'fade'):?> checked <?php endif;?>> fade<?php endif;?><?php elseif ($item['type'] == 'checkbox'):?><input name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value=true <?php if ($options[$item['id']]):?> checked <?php endif;?> size=80><?php elseif ($item['type'] == 'textarea'):?><textarea style="width:500px"  name="<?php echo 'gplus_options['.$item['id'].']'; ?>" rows="8" cols="50"><?php if ($options[$item['id']]){ echo gplus_stripvalue($options[$item['id']]);} else {echo gplus_stripvalue($item['default_value']);} ; ?></textarea><?php else:?><input style=width:500px name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" <?php if ( $options[$item['id']] != "") {?> value="<?php echo $options[$item['id']]; ?>" <?php }else{?> value="" <?php } ?> size=80><?php endif;?><br><label class=description for="<?php echo 'gplus_options['.$item['id'].']'; ?>"><?php echo $item['desc']; ?></label><?php } ?></table><p class=submit><input type=submit class=button-primary value="<?php _e( 'Save Options' , 'gplus'); ?>"></p></form></div><?php
}

function gplus_options_validate($input) {
	global $gplus_items;
	foreach ( $gplus_items as $item ) {
		$input[$item['id']] = wp_filter_nohtml_kses($input[$item['id']]);
	}
	return $input;
}

function gplus_is_pjax(){
	return array_key_exists('HTTP_X_PJAX', $_SERVER) && $_SERVER['HTTP_X_PJAX'];
}
function gplus_is_get()
{
	return $_SERVER['REQUEST_METHOD'] == 'GET';
}
/**
 * 检测请求方式是否为POST
 */
function gplus_is_post()
{
	return $_SERVER['REQUEST_METHOD'] == 'POST';
}
function gplus_is_ie(){
	return !!(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE") !== false);
}
function gplus_is_ie6(){
	return !!(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE 6") !== false);
}
function gplus_version(){
	return '__CURRENT__VERSION__';
}
/**
 * 
 * 获取最新文章的最后修改时间
 */
function gplus_max_post_time(){
	global $wpdb,$table_prefix;
	$sql = "select post_modified as time from ".$table_prefix."posts where post_status='publish' ORDER BY ID DESC LIMIT 1 ";
	$result = $wpdb->get_results($sql);
	if (is_array($result)){
		$time = $result[0]->time;
		return strtotime($time);
	}
	return null;
}
/**
 * 
 * 获取关键字和描述
 */
function gplus_get_keywords_description(){
	global $post;
	if (is_home()){
		$keywords = get_bloginfo('name');
		$description = get_bloginfo('description');
	}elseif (is_single()){
		if ($post->post_excerpt) {
	        $description = $post->post_excerpt;
	    } else {
	    	if (WPLANG === 'zh_CN'){
	    		$len = 100;
	    	}else{
	    		$len = 200;
	    	}
	        $description = mb_substr(strip_tags($post->post_content), 0, $len);
	    }
	    $cate = get_the_category();
		$keywords = array();
		foreach ($cate as $item){
			$keywords[] = $item->name;
		}     
	    $tags = wp_get_post_tags($post->ID);
	    foreach ($tags as $tag ) {
	        $keywords[] = $tag->name;
	    }
	    $keywords = array_unique($keywords);
	    $keywords = join(', ', $keywords);
	}
	return array($keywords, $description);
}
/**
 * 
 * 获取配置项
 */
function gplus_get_options(){
	static $options = array();
	if (count($options) === 0){
		$options = get_option('gplus_options');
	}
	return $options;
}
function gplus_stripvalue($value){
	if (get_magic_quotes_gpc()){
		return stripslashes($value);
	}
	return $value;
}

//////// custom excerpt
function gplus_excerpt_length( $length ) {
	$options = gplus_get_options();
	if ( $options['excerpt_words'] ) { return $options['excerpt_words']; } else { return 200;}
}
add_filter( 'excerpt_length', 'gplus_excerpt_length' );

function gplus_archive() {
	global $wpdb, $month;
	$lastpost = $wpdb->get_var ( "SELECT ID FROM $wpdb->posts WHERE post_date <'" . current_time ( 'mysql' ) . "' AND post_status='publish' AND post_type='post' AND post_password='' ORDER BY post_date DESC LIMIT 1" );
	$output = get_option ( 'gplus_archives_' . $lastpost );
	if (empty ( $output )) {
		$output = '';
		$wpdb->query ( "DELETE FROM $wpdb->options WHERE option_name LIKE 'SHe_archives_%'" );
		$q = "SELECT DISTINCT YEAR(post_date) AS year, MONTH(post_date) AS month, count(ID) as posts FROM $wpdb->posts p WHERE post_date <'" . current_time ( 'mysql' ) . "' AND post_status='publish' AND post_type='post' AND post_password='' GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date DESC";
		$monthresults = $wpdb->get_results ( $q );
		if ($monthresults) {
			foreach ( $monthresults as $monthresult ) {
				$thismonth = zeroise ( $monthresult->month, 2 );
				$thisyear = $monthresult->year;
				$q = "SELECT ID, post_date, post_title, comment_count FROM $wpdb->posts p WHERE post_date LIKE '$thisyear-$thismonth-%' AND post_date AND post_status='publish' AND post_type='post' AND post_password='' ORDER BY post_date DESC";
				$postresults = $wpdb->get_results ( $q );
				if ($postresults) {
					$text = sprintf ( '%s.%d',  $monthresult->year,$monthresult->month );
					$postcount = count ( $postresults );
					$output .= '<ul class="archives-list"><li>' . '<h3>'.$text . ' &nbsp;(' . count ( $postresults ) . ') '.'</h3><ul class="list">' . "\n";
					foreach ( $postresults as $postresult ) {
						if ($postresult->post_date != '0000-00-00 00:00:00') {
							$url = get_permalink ( $postresult->ID );
							$arc_title = $postresult->post_title;
							if ($arc_title)
								$text = wptexturize ( strip_tags ( $arc_title ) );
							else
								$text = $postresult->ID;
							$title_text = __ ( 'View this post', 'gplus' ) . ', &quot;' . wp_specialchars ( $text, 1 ) . '&quot;';
							$output .= '<li>'. "<a href='$url' title='$title_text'>$text</a>";
							$output .= '&nbsp;<span style="color:#aaa">(' . $postresult->comment_count . ')</span>';
							$output .= '</li>' . "\n";
						}
					}
				}
				$output .= '</ul></li></ul>' . "\n";
			}
			update_option ( 'gplus_archives_' . $lastpost, $output );
		} else {
			$output = '<div class="errorbox">' . __ ( 'Sorry, no posts matched your criteria.', 'gplus' ) . '</div>' . "\n";
		}
	}
	echo $output;
}
function get_comment_se_key(){
	$options = gplus_get_options();
	if ($options['comment_se_key']) {
		return $options['comment_se_key'];
	};
	return "welefen_gplus_theme";
}
function get_comment_token(){
	$key = get_comment_se_key();
	$x = rand(10, 50);
	$y = rand(10, 50);
	return array(
		"text" => $x . '+' . $y,
		"token" => md5(($x + $y) . $key)
	);
}

function check_comment_token($comment = array()){
	$comment_token = $_POST['comment_token'];
	$comment_token_value = $_POST['comment_token_value'];
	$se_key = get_comment_se_key();
	$md5 = md5($comment_token_value . $se_key);
	if ($md5 != $comment_token) {
		exit("comment token error");
	}
	return $comment;
}

add_filter('preprocess_comment', 'check_comment_token');
