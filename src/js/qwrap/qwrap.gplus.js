(function(){
	var endPjaxTimer = 0;
	W('#content').on('pjax.start', function(cache){
		W('.loading').show();
		endPjaxTimer = setTimeout(function(){
			endPjaxTimer = 0;
			W('#content').fire('pjax.end');
		}, 3000);
	});
	var li = W('header nav li');
	W('#content').on('pjax.end', function(cache){
		if(endPjaxTimer){
			clearTimeout(endPjaxTimer);
			endPjaxTimer = 0;
		}
		W('.loading').hide();
		li.removeClass('current-menu-item');
		li.forEach(function(el){
			var href = W('a', el).attr('href'), h;
			href = QW.pjax.util.getRealUrl(href);
			h = QW.pjax.util.getRealUrl(location.href);
			if(href == h || (href+'/') == h || href == (h+'/')){
				W(el).addClass('current-menu-item');
				return false;
			}
		});
		typeof pjaxCallback != 'undefined' && pjaxCallback && pjaxCallback();

		removeStorageCache();
	});
	QW.pjax({
		selector: 'a[href^="'+pjaxHomeUrl+'"]',
		container: '#content',
		show: typeof pjaxFx == 'undefined' ? '' : pjaxFx,
		cache: typeof pjaxCacheTime == 'undefined' ? true : pjaxCacheTime,
		storage: typeof pjaxUseStorage == 'undefined' ? true : pjaxUseStorage,
		titleSuffix: pjaxTitleSuffix,
		filter: function(href){
			if(href.indexOf('feed')> -1 ||href.indexOf('wp-login.php')> -1 || href.indexOf('wp-content/') > -1 || href.indexOf('wp-admin/') > -1 || href.indexOf('/lab/') > -1){
				return true;
			}
		}
	})
	function removeStorageCache(){
		//remove current href cache when a comment added.
		W('#commentform').submit(function(){
			var href = location.href.replace(/\/comment\-page.*/, '');
			QW.pjax.util.removeCache(href);
		})
	}

	removeStorageCache();
})();