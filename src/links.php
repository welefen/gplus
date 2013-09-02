<?php 
/*
Template Name: Links
*/
if (!gplus_is_pjax()) { get_header();$options = gplus_get_options(); ?>
<div id="content">
<?php };?>
	<?php the_post(); ?>
	<section class="post-page"><!-- post div -->
		<h2 class="title"><?php the_title() ?></h2>
		<div class="entry links">
			<?php wp_list_bookmarks('categorize=1&category_orderby=id&before=<li>&after=</li>&show_images=0&show_description=1&orderby=name&title_before=<h3>&title_after=</h3>'); ?>
		</div>
	</section>
<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
<?php };?>