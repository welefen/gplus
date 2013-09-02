<?php
/**
 * Gplus Recent Comments
 */
class Gplus_Recent_Comments_Widget extends WP_Widget{
	public function __construct(){
		$widget_ops = array('description' => 'Recent Comments');
        $control_ops = array('width' => "auto", 'height' => 300);
        parent::__construct(false, $name = 'Recent Comments',$widget_ops,$control_ops); 
	}
	public function form($instance){
		$title = esc_attr($instance['title']);
		$number = esc_attr($instance['number']);
	    ?>
	    <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php esc_attr_e('Title:'); ?> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></label></p>
	   	 <p><label for="<?php echo $this->get_field_id('number'); ?>"><?php esc_attr_e('Number:'); ?> <input class="widefat" id="<?php echo $this->get_field_id('number'); ?>" name="<?php echo $this->get_field_name('number'); ?>" type="text" value="<?php echo $number; ?>" /></label></p>
	    <?php
	}
	public function update($newInstance, $oldInstance){
		return $newInstance;
	}
	public function widget($args, $instance){
		global $wpdb;
		extract($args, EXTR_SKIP);
		$title = apply_filters('widget_title', empty($instance['title']) ? __('Recent Comments','gplus') : $instance['title']);
		if ( !$number = (int) $instance['number'] )
            $number = 5;
        else if ( $number < 1 )
            $number = 1;
        else if ( $number > 30 )
            $number = 30;
       	 if ( !$comments = wp_cache_get( 'gplus_recent_comments', 'widget' ) ) {
       	 		$request = "SELECT ID, comment_ID, comment_content, comment_author,post_title FROM $wpdb->posts, $wpdb->comments WHERE $wpdb->posts.ID=$wpdb->comments.comment_post_ID AND post_status = 'publish'";
				$request .= " AND comment_approved = '1'  and comment_type not in ('pingback','trackback') ORDER BY $wpdb->comments.comment_date DESC LIMIT $number";
            $comments = $wpdb->get_results($request);
            wp_cache_add( 'gplus_recent_comments', $comments, 'widget' );
        }
        echo $before_widget;
        if ( $title ) echo $before_title . $title . $after_title;
        echo '<ul id="recentcomments">';
        foreach ($comments as $comment) {
        	echo '<li class="recent-comment-item">';
			//content
			$content = apply_filters('get_comment_text', $comment->comment_content);
			$content = strip_tags($content);
            #$content = mb_strimwidth(strip_tags($content),0,'200','...','UTF-8');
            $content = convert_smilies($content);
            #$content = str_replace('"', '&quot;', $content);
            //comment author
			$comment_author = stripslashes($comment->comment_author);

			$post_title = str_replace('"', '&quot;', $comment->post_title);

			$permalink = get_permalink($comment->ID) . '#comment-' . $comment->comment_ID;
			echo ' <a href="'.$permalink.'" title="'. $post_title .'">' . $comment_author . '</a>: ' . $content;
			echo '</li>';
		}
        echo '</ul>';
        echo $after_widget;
	}
}