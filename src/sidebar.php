<?php flush(); ?>
<aside class="r">
<?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar('primary-widget-area') ) : ?>
	<section>
		<h3><?php _e('Random Posts', 'gplus'); ?></h3>
		<ul>
			<?php
			$rand_posts = get_posts('numberposts=5&orderby=rand');
			foreach( $rand_posts as $post ) :
			?>
			<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
			<?php endforeach; ?>
		</ul>
	</section>
	<section class="widget">
		<h3><?php _e('Search by Tags!', 'gplus'); ?></h3>
		<div><?php wp_tag_cloud('smallest=9&largest=18'); ?></div>
	</section>	
	<section class="widget">
		<h3><?php _e('Archives', 'gplus'); ?></h3>
		<ul>
			<?php wp_get_archives( 'type=monthly' ); ?>
		</ul>
	</section>
	<section class="widget">
		<h3><?php _e('Links', 'gplus'); ?></h3>
		<ul>
			<?php wp_list_bookmarks('title_li=&categorize=0&orderby=id'); ?>
		</ul>
	</section>
	<section class="widget">
		<h3><?php _e('Meta', 'gplus'); ?></h3>
		<ul>
			<?php wp_register(); ?>
			<li><?php wp_loginout(); ?></li>
			<?php wp_meta(); ?>
		</ul>
	</section>
<?php endif; ?>
</aside>
<?php flush(); ?>
