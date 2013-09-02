<?php 
ob_start();
ob_end_flush(); 
ob_implicit_flush(1); 
?>
<?php $options = gplus_get_options();?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> <?php if ($options['use_manifest']):?>manifest="<?php echo home_url();?>?manifest=welefen"<?php endif;?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>" />
	<meta name="viewport" content="width=980" />
<?php $the_title = wp_title(' - ', false); if ($the_title != '') : ?>
    <title><?php echo wp_title('',false); ?> | <?php bloginfo('name'); ?></title>
<?php else : ?>
	<title><?php bloginfo('name'); ?><?php if ( $paged > 1 ) echo ( ' - page '.$paged ); ?></title>
<?php endif; ?>
	<?php $kd = gplus_get_keywords_description();?>
	<?php if (is_array($kd) && $kd[0]):?>
	<meta name="keywords" content="<?php echo $kd[0];?>" />
	<meta name="description" content="<?php echo $kd[1];?>" />
	<?php endif;?>
	<?php if ( is_singular() && get_option( 'thread_comments' ) ) wp_enqueue_script( 'comment-reply' ); ?>
	<link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'stylesheet_url' ); ?>?v=<?php echo gplus_version();?>" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
	<?php if (gplus_is_ie()):?>
	<!--[if IE]>
	<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/html5.js"></script>
	<![endif]--> 
	<?php endif;?>
	<?php wp_head(); ?>
</head>
<?php flush(); ?>
<body <?php if(is_admin_bar_showing()) : ?> class="show-admin-bar";<?endif;?> >
<header <?php if ($options['header_not_fixed'] || gplus_is_ie6()) :?>class="notfixed"<?php endif;?>>
	<div class="g98 clearfix">
		<h1 class="logo l"><a href="<?php echo home_url(); ?>" title="<?php bloginfo('name'); ?> - <?php bloginfo('description');?>">
		<?php if ( $options['logo_url'] ) : ?>
			<img title="<?php bloginfo('name'); ?>" src="<?php echo $options['logo_url']  ;?>"  alt="<?php bloginfo('name'); ?>" />
		<?php else:?>
		<?php bloginfo('name'); ?>
		<?php endif; ?>	
		</a>
		</h1>
	
		<nav class="l">
			<ul>
			<li class="first <?php if ( is_home() ) { echo 'current_page_item'; }?>">
			<a href="<?php echo home_url(); ?>"><?php _e('Home', 'gplus'); ?></a>
			</li></ul>
		<?php wp_nav_menu( array( 'container' => 'none', 'theme_location' => 'primary' ) ); ?>
		</nav>

		<div class="search r">
			<?php get_search_form(); ?>
		</div>
		<a href="<?php if ($options['rss_url']) { echo $options['rss_url'];} else {echo bloginfo('rss2_url');}?>" title="rss" class="rss r">
			<img src="<?php echo home_url();?>/wp-content/themes/gplus/rss.png">
		</a>
	</div>
</header>
<?php if ($options['header_not_fixed'] || gplus_is_ie6()) :?>
<div class="g98 clearfix mt20">
<?php else :?>
<div class="wrapper g98 clearfix" >
<?php endif;?>
