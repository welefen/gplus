<?php if (!gplus_is_pjax()) { get_header(); $options = gplus_get_options();?><div id="content">
<?php };?>

	<?php if ($options['404img_url']):?>
	<img alt="img404" class="img404" src="<?php echo $options['404img_url']?>" width="700" />
	<?php else :?>
	<h2 class="title"><?php _e('Error 404 - Not Found', 'gplus'); ?></h2>
	<p><?php _e('Sorry, but you are looking for something that isn&#8217;t here.', 'gplus'); ?></p>
	<?php endif;?>
	<h2 class="title" style="margin-top:20px;"><?php _e('Random Posts', 'gplus'); ?></h3>
	<ul>
		<?php
			$rand_posts = get_posts('numberposts=5&orderby=rand');
			foreach( $rand_posts as $post ) :
		?>
		<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
		<?php endforeach; ?>
	</ul>
	<h2 class="title" style="margin-top:20px;"><?php _e('Tag Cloud', 'gplus'); ?></h2>
			<?php wp_tag_cloud('smallest=9&largest=22&unit=pt&number=200&format=flat&orderby=name&order=ASC');?>
		
<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
<?php };?>