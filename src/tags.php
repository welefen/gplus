<?php 
/*
Template Name: Tags Cloud
*/
if (!gplus_is_pjax()) { get_header();$options = gplus_get_options(); ?>
<div id="content">
<?php };?>
	<?php the_post(); ?>
	<section class="post-page"><!-- post div -->
		<h2 class="title"><?php the_title() ?></h2>
		<div class="entry" style="line-height:40px;">
			<?php wp_tag_cloud('smallest=14&largest=46&unit=px&number=500');?> 
		</div>
	</section>
<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
<?php };?>