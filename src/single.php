<?php if (!gplus_is_pjax()) { get_header();?>
<div id="content">
<?php };?>


	<?php the_post();$options = gplus_get_options(); ?>
	<article class="detail">
		<h2 class="title"><?php the_title() ?></h2>
		<p class="desc">
		<?php _e('date', 'gplus'); ?>: <?php the_time('Y-m-d'); ?>&nbsp;&nbsp;&nbsp;
		<?php if ($options['show_author']):?>
		<?php printf(__('Author：%s', 'gplus'), get_the_author_meta('display_name')); ?>&nbsp;&nbsp;&nbsp;
		<?php endif;?>
		<?php printf(__('IN：%s', 'gplus'), get_the_category_list(', ')); ?>&nbsp;&nbsp;&nbsp;
		<?php the_tags(__('Tags:', 'gplus') . ' ', ', ', ''); ?> &nbsp;&nbsp;&nbsp;
		<?php if(function_exists('the_views')) {the_views();echo '&nbsp;&nbsp;&nbsp;';} ?>
		<?php _e('Comments：', 'gplus') . comments_popup_link('0', '1', '%', '', '已关闭'); ?>
		</p>
		<div class="detail clearfix">
			<?php  the_content(__('Read more &raquo;', 'gplus'));  ?>
		<?php if(is_sticky()) { ?>
			<p><?php _e('This is a sticky post!', 'gplus'); ?> <a href="<?php the_permalink() ?>" class="more-links"><?php _e('continue reading?', 'gplus'); ?></a></p>
		<?php } ?>
		</div>
		<?php if(!$options['use_vender_comment']): ?>
		<div>-- EOF -- 看完了，<a href="#commentForm">留个脚印~~</a> ^_^</div>
	<?php endif; ?>
	</article>
	<?php comments_template( '', true ); ?>
	
<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
<?php };?>
