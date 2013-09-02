<?php if (!gplus_is_pjax()) { get_header(); ?>
<div id="content">
<?php };?>


	<?php $options = gplus_get_options();the_post(); ?>
	<div class="cate">
		<?php if ( is_day() ) : ?>
			<h2><?php printf((__('Daily Archives:', 'gplus').' <span>%s</span>'),get_the_time(get_option('date_format'))) ?></h2>
		<?php elseif ( is_month() ) : ?>
			<h2><?php printf((__('Monthly Archives:', 'gplus').' <span>%s</span>'),get_the_time('F Y')) ?></h2>
		<?php elseif ( is_year() ) : ?>
			<h2><?php printf((__('Yearly Archives:', 'gplus').' <span>%s</span>'),get_the_time('Y')) ?></h2>
		<?php elseif ( is_category() ) : ?>
			<h2><?php printf((__('Category Archives:', 'gplus').' <span>%s</span>'),single_cat_title('',false)) ?></h2>
		<?php elseif ( is_tag() ) : ?>
			<h2><?php printf((__('Tag Archives:', 'gplus').' <span>%s</span>'),single_tag_title('',false)) ?></h2>
		<?php elseif ( isset($_GET['paged']) && !empty($_GET['paged']) ) : ?>
			<h2><?php _e('Blog Archives', 'gplus'); ?></h2>
		<?php endif; ?>
	</div>
	<?php rewind_posts(); ?>
	
	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<article class="item clearfix">
		<h2 class="title">
			<a href="<?php the_permalink() ?>"><?php the_title() ?></a>
		</h2>
		<p class="desc">
		<?php if ($options['show_author']):?>
		<?php printf(__('Author：%s'), get_the_author_meta('display_name')); ?>&nbsp;&nbsp;&nbsp;
		<?php endif;?>
		<?php printf(__('IN：%s'), get_the_category_list(', ')); ?>&nbsp;&nbsp;&nbsp;
		<?php the_tags(__('Tags:') . ' ', ', ', ''); ?> &nbsp;&nbsp;&nbsp;
		<?php if(function_exists('the_views')) {the_views();echo '&nbsp;&nbsp;&nbsp;';} ?>
		<?php _e('Comments：', 'gplus') . comments_popup_link('0', '1', '%', '', 'closed'); ?>
		</p>
		<summary>
			<?php if ( $options['excerpt_check']=='true' ) { the_excerpt(__('Read more &raquo;', 'gplus')); } else { the_content(__('Read more &raquo;', 'gplus')); } ?>
		<?php if(is_sticky()) { ?>
			<p><?php _e('This is a sticky post!', 'gplus'); ?> <a href="<?php the_permalink() ?>" class="more-links"><?php _e('continue reading?', 'gplus'); ?></a></p>
		<?php } ?>
		</summary>
		<div class="date" title="<?php the_time('Y-m-d H:i:s')?>">
			<div class="md"><?php the_time('m-d'); ?></div>
			<div class="y"><?php the_time('Y'); ?></div>
		</div>
	</article>
	<?php endwhile; ?>
	<div class="highline"></div>
	<?php  else: ?>
	<div class="post post-single">
		<h2 class="title title-single"><a href="#" title="<?php _e('Error 404 - Not Found', 'gplus'); ?>"><?php _e('Error 404 - Not Found', 'gplus'); ?></a></h2>
		<div class="post-info-top" style="height:1px;"></div>
		<div class="entry">
			<p><?php _e('Sorry, but you are looking for something that isn&#8217;t here.', 'gplus'); ?></p>
			<h3><?php _e('Random Posts', 'gplus'); ?></h3>
			<ul>
				<?php
					$rand_posts = get_posts('numberposts=5&orderby=rand');
					foreach( $rand_posts as $post ) :
				?>
				<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
				<?php endforeach; ?>
			</ul>
			<h3><?php _e('Tag Cloud', 'gplus'); ?></h3>
			<?php wp_tag_cloud('smallest=9&largest=22&unit=pt&number=200&format=flat&orderby=name&order=ASC');?>
		</div><!--entry-->
	</div><!--post-->
	<?php endif; ?>
<?php
if(function_exists('wp_page_numbers')) {
	wp_page_numbers();
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
