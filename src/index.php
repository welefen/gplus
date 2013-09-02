<?php $options = gplus_get_options();if ($_GET['manifest'] === 'welefen') :?>
<?php
header('Content-Type: text/cache-manifest');
$content = trim($options['manifest_value']);
$time = gplus_max_post_time();
if ($time){
	$content = preg_replace("/\#\s*VERSION(?:.*?)\\n/ies", "", $content);
	$content = str_replace("CACHE MANIFEST", "CACHE MANIFEST\n# VERSION 1." . $time, $content);
}
echo $content;
?>
<?php else :?>
<?php if (!gplus_is_pjax()) { get_header(); ?>
<div id="content">
<?php };?>
	<?php if (have_posts()) : while (have_posts()) : the_post();?>
	<article class="item clearfix">
		<h2 class="title">
			<a href="<?php the_permalink() ?>"><?php the_title() ?></a>
		</h2>
		<p class="desc">
		<?php if ($options['show_author']):?>
		<?php printf(__('Author: %s', 'gplus'), get_the_author_meta('display_name')); ?>&nbsp;&nbsp;&nbsp;
		<?php endif;?>
		<?php printf(__('IN: %s', 'gplus'), get_the_category_list(', ')); ?>&nbsp;&nbsp;&nbsp;
		<?php the_tags(__('Tags:', 'gplus') . ' ', ', ', ''); ?> &nbsp;&nbsp;&nbsp;
		<?php if(function_exists('the_views')) {the_views();echo '&nbsp;&nbsp;&nbsp';} ?>
		<?php _e('Comments: ', 'gplus') . comments_popup_link('0', '1', '%', '', 'comments closed'); ?>
		</p>
		<summary class="clearfix">
			<?php if ( $options['excerpt_check']=='true' ) { the_excerpt(__('Read more &raquo;', 'gplus')); } else { the_content(__('Read more &raquo;', 'gplus')); } ?>
		<?php if(is_sticky()) { ?>
			<p><?php _e('This is a sticky post!', 'gplus'); ?> <a href="<?php the_permalink() ?>" class="more-links"><?php _e('continue reading?', 'gplus'); ?></a></p>
		<?php } ?>
		</summary>
		<div class="date" title="<?php the_time("Y-m-d H:i:s")?>">
			<div class="md"><?php the_time('m-d'); ?></div>
			<div class="y"><?php the_time('Y'); ?></div>
		</div>
	</article>
	<?php endwhile; ?>
	<div class="highline"></div>
	<?php else: ?>
	<?php $old = $_SERVER['HTTP_X_PJAX'];$_SERVER['HTTP_X_PJAX'] = 'true';include_once '404.php'; $_SERVER['HTTP_X_PJAX'] = $old;?>
	<?php endif; ?>
<?php
if(function_exists('wp_page_numbers')) {
	wp_page_numbers();
}
elseif(function_exists('wp_paginate')) {
	wp_paginate();
}
elseif(function_exists('wp_pagenavi')) {
	wp_pagenavi();
} else {
	global $wp_query;
	$total_pages = $wp_query->max_num_pages;
	if ( $total_pages > 1 ) {
		echo '<div class="pagination">';
			posts_nav_link(' | ', __('&laquo; Previous page', 'gplus'), __('Next page &raquo;', 'gplus'));
		echo '</div>';
	}
}
?>

<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
<?php };?>
<?php endif;?>
