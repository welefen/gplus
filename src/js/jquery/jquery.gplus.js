$(function(){
	var keyBind = false;
	function animate(line, next){
		var top = next.position().top;
		line.animate({
			top: top,
			height: next.height()
		});
		$('html,body').animate({
			scrollTop: top
		});
	}
	function showLine(){
		var article = $('article.item'), len = article.length, line = $('.highline'), current = 0, art, next, filterList;
		if(!len) return true;
		art = $(article[0]);
		line.css({
			top: art.position().top,
			height: art.height()
		}).show();
		filterList = {
			'106': function(){
				return !!(current < (len-1) &&  ++current);
			},
			'107': function(){
				return !!(current > 0 && current--);
			}
		};
		if(!keyBind){
			keyBind = true;
			$(document).keypress(function(event){
				var keyCode = (event.keyCode || event.which) + '';
				if(len && keyCode in filterList && filterList[keyCode]()){
					next = $($('article.item')[current]);
					animate($('.highline'), next);
				}
			});
			$(document.body).delegate('article.item', 'click', function(){
				var $this = $(this), pos = $.inArray(this, $('article.item'));
				if(pos == current) return true;
				current = pos;
				animate($('.line'), $this);
			});
		}
	}
	showLine();
	
	var endPjaxTimer = 0;
	$('#content').bind('pjax.start', function(cache){
		$('.loading').show();
		endPjaxTimer = setTimeout(function(){
			endPjaxTimer = 0;
			$('#content').trigger('pjax.end');
		}, 3000);
	});
	var li = $('header nav li');
	$('#content').bind('pjax.end', function(cache){
		if(endPjaxTimer){
			clearTimeout(endPjaxTimer);
			endPjaxTimer = 0;
		}
		$('.loading').hide();
		li.removeClass('current-menu-item');
		li.each(function(){
			var href = $(this).find('a').attr('href'), h;
			href = $.pjax.util.getRealUrl(href);
			h = $.pjax.util.getRealUrl(location.href);
			if(href == h || (href+'/') == h || href == (h+'/')){
				$(this).addClass('current-menu-item');
				return false;
			}
		});
		showLine();
		typeof pjaxCallback != 'undefined' && pjaxCallback && pjaxCallback();

		removeStorageCache();

		if(!location.hash){
			 $("html, body").animate({ scrollTop: 0 }, 300);
		}
	});

	$.pjax({
		selector: 'a[href^="'+pjaxHomeUrl+'"]',
		container: '#content',
		show: typeof pjaxFx == 'undefined' ? '' : pjaxFx,
		cache: typeof pjaxCacheTime == 'undefined' ? true : pjaxCacheTime,
		storage: typeof pjaxUseStorage == 'undefined' ? true : pjaxUseStorage,
		titleSuffix: pjaxTitleSuffix,
		filter: function(href){
			if(href.indexOf('feed')> -1 || href.indexOf('wp-login.php')> -1 ||href.indexOf('wp-content/') > -1 || href.indexOf('wp-admin/') > -1|| href.indexOf('/lab/') > -1){
				return true;
			}
		}
	});
	function removeStorageCache(){
		//remove current href cache when a comment added.
		$('#commentform').submit(function(){
			var href = location.href.replace(/\/comment\-page.*?/, '');
			$.pjax.util.removeCache(href);
		})
	}
	removeStorageCache();
});