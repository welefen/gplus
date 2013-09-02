<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */
// Do not delete these lines
if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
	die ('Please do not load this page directly. Thanks!');
if ( post_password_required() ) { ?>
	<p class="nocomments"><?php _e('This post is password protected. Enter the password to view comments.', 'gplus'); ?></p>
<?php
	return;
}
?>
<?php 
$options = gplus_get_options();
if($options['use_vender_comment']){
?>
<!--<h2 class="title comments-title ellipsis">Comments for <?php the_title();?></h2>
<a name="comments"></a>
<div name="commentForm" style="padding:10px 0;">
<iframe width="100%" height="500"  frameborder="0" scrolling="no" src="http://widget.weibo.com/distribution/comments.php?language=zh_cn&width=0&height=500&skin=1&dpc=1&url=<?php the_permalink() ?>&titlebar=1&border=1&appkey=&colordiy=0&dpc=1"></iframe>
</div>-->
<?php
	return true;
}
?>
<!-- You can start editing here. -->

	<?php if ( have_comments() ) { ?>
		<a name="comments"></a>
		<h2 class="title comments-title ellipsis"><?php comments_number('0', '1', '%' );?> Comments for <?php the_title();?></h2>
		<ul class="comments-list clearfix">
			<?php wp_list_comments('type=comment&callback=gplus_comment'); ?>
		</ul>
		<?php $result = paginate_comments_links(array('echo'=> false)); if ($result):?>
		<div class="navigation"><?php echo $result;?></div>
		<?php endif;;?>
		
	<?php } else { // this is displayed if there are no comments so far ?>
	<?php if ( ! comments_open() && !is_page() ) { ?>
			<div class="comments-wrap"><h2 class="title"><?php _e('Comments are closed.', 'gplus'); ?></h2></div>
	<?php } // end ! comments_open() ?>

	<?php } // end have_comments() ?>

	<?php
	
	$options = get_option('gplus_options');
	//$comment_notes='<p class="comment-note">' . __('NOTE - You can use these ') . sprintf(('<abbr title="HyperText Markup Language">HTML</abbr> tags and attributes:<br />%s' ), ' <code>' . allowed_tags() . '</code>' ) . '</p>';
	//if($options['comment_notes']=='true') $comment_notes='';
	//if($options['smilies']=='true') $smilies=''; else $smilies='<p class="smilies">'.$smilies.'</p>';
	$smilies = '';
	ob_start();
	if ( function_exists(cs_print_smilies) ) {cs_print_smilies();}
	$smilies = ob_get_contents();
	ob_end_clean();
	$comment_token = get_comment_token();
	$fields =  array(
			'author' => '<p class="comment-item">' .
			'<input class="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30" />'. ' <label for="author">' . __( 'NAME', 'gplus' ) . ' <span class="red">*</span> </label></p>',
			'email'  => '<p class="comment-item">' .
			'<input class="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" size="30" /> <label for="email">' . __( 'EMAIL', 'gplus' ) . ' <span class="red">*</span> </label></p>',
			'url'    => '<p class="comment-item">' .
			'<input class="url" name="url" type="text" value="' . esc_attr( $commenter['comment_author_url'] ) . '" size="30" /> <label for="url">' . __( 'Website URL', 'gplus' ) . '</label></p>',
			);
	$comment_field = '<input type="hidden" name="comment_token" value="' . $comment_token['token'] .'"/>'.$smilies.'<p class="comment-form-comment"><textarea aria-required="true" rows="8" style="width:400px" cols="90" name="comment" class="comment" id="comment" onkeydown="if(event.ctrlKey){if(event.keyCode==13){document.getElementById(\'submit\').click();return false}};"></textarea></p>' . '<p><input class="author" style="width:100px" type="text" name="comment_token_value" /> '.$comment_token['text'].' <span class="red">*</span></p>';
	$args = array(
			'fields'               => apply_filters( 'comment_form_default_fields', $fields ),
			'comment_notes_before' => '',
			'comment_field'        => $comment_field,
			'comment_notes_after'  => $comment_notes,
			'title_reply'          => __( 'Leave a Comment', 'gplus'),
			'title_reply_to'       => __('Reply to %s &not;<br />', 'gplus'), 
			'cancel_reply_link'    => __( '<small>Cancel reply</small>', 'gplus' ),
			'label_submit'         => __( 'SUBMIT', 'gplus' )
			);
	echo "<a name='commentForm'></a>";
	comment_form($args); 

	$havepings = 0;
	foreach($comments as $comment){ 
		if(get_comment_type() != 'comment' && $comment->comment_approved != '0'){ 
			$havepings = 1; 
			break; 
		} 
	}
	if($havepings == 1) : ?>
		<div class="trackbacks-pingbacks">
			<h3><?php _e('Trackbacks and Pingbacks:', 'gplus'); ?></h3>
			<ul id="pinglist">
				<?php wp_list_comments('type=pings&per_page=0&callback=gplus_custom_pings'); ?>
			</ul>
		</div>
	<?php endif; ?>