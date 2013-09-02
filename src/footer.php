</div>
<?php flush(); ?>
<footer>
	&copy; <?php echo date("Y"); ?>&nbsp;<?php bloginfo('name'); ?> - <a href="http://wordpress.org/">WordPress</a> - <a href="http://www.welefen.com/tag/gplus" title="gplus theme designed by welefen">gplus</a>
</footer>

<?php wp_footer();?>
<?php $options = gplus_get_options();?>

<?php if (!gplus_is_ie() && !($options['not_use_ajax'])):?>
	<div class="loading"><span>loading...</span></div>
	<script>var pjaxHomeUrl = "<?php echo home_url();?>", pjaxTitleSuffix=" | <?php bloginfo('name'); ?>", pjaxUseStorage=<?php if ($options['not_use_storage']):?>false<?php else :?>true<?php endif;?>, pjaxCacheTime=<?php if (strlen($options['cache_time'])):echo intval($options['cache_time'])?><?php else :?>true<?php endif;?>, pjaxFx="<?php echo $options['show_fx']?>",pjaxCallback=function(){try{<?php echo ($options['callback_function'] ? gplus_stripvalue($options['callback_function']) : ';');?>}catch(e){}}</script>
	<?php if ($options['js_framework'] == 'qwrap'):?>
		<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/qwrap.all.js?v=<?php echo gplus_version();?>"></script>
	<?php elseif($options['js_framework'] == 'kissy') :?>
		<script src="http://a.tbcdn.cn/s/kissy/1.2.0/kissy.js"></script>
		<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/kissy.all.js?v=<?php echo gplus_version();?>"></script>
	<?php else:?>
		<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/jquery.all.js?v=<?php echo gplus_version();?>"></script>
	<?php endif;?>
<?php endif;?>

<?php if ($options['tongji_js_value']):?>
	<?php if (strpos($options['tongji_js_value'], '</script>') === false):?>
		<script type="text/javascript"><?php echo stripslashes($options['tongji_js_value']);?></script>
	<?php else :?>
		<?php echo stripslashes($options['tongji_js_value']);?>
	<?php endif;?>
<?php endif;?>

<?php if( $options['show_reply']):?>
	<script>
	(function(){
	var oldReplyTitle='',$ = function(el){return document.getElementById(el)};
	window.replyComment = function(id, author){
		if(!oldReplyTitle){oldReplyTitle = $('reply-title').innerHTML;}
		$('comment_parent').value = id;
		var comment = $('commentText'+id).innerHTML,
		 	cancel = '&nbsp;<a onclick="cancelReplyComment();return false" style="cursor:pointer">取消回复</a>',
		 	text = '回复 '+ author+ " 的评论: "+ comment + cancel;
		$('reply-title').innerHTML = text;
	};window.cancelReplyComment=function(){$('comment_parent').value = 0;$('reply-title').innerHTML = oldReplyTitle;}
	})()
	</script>
<?php endif;?>

<?php if($options['use_opti_syntaxhighlighter']):?>
<link rel="stylesheet" type="text/css" href="<?php echo home_url();?>/wp-content/themes/gplus/css/syntaxhighlighter.css?v=<?php echo gplus_version();?>" />
<script src="<?php echo home_url();?>/wp-content/themes/gplus/js/syntaxhighlighter.js?v=<?php echo gplus_version();?>" type="text/javascript" charset="utf-8" async defer></script>
<?php endif;?>

</body>
</html>