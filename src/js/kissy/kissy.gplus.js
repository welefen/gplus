KISSY.use("dom,sizzle", function(S,DOM){
	var endPjaxTimer = 0;
	S.Event.on('#content', 'pjax.start', function(cache){
	//S.one('#content').on('pjax.start', function(cache){
		S.one('.loading').show();
		endPjaxTimer = setTimeout(function(){
			endPjaxTimer = 0;
			S.one('#content').fire('pjax.end');
		}, 3000);
	});
	var li = S.all(DOM.query('header nav li'));
	//S.one('#content').on('pjax.end', function(cache){
	S.Event.on('#content', 'pjax.end', function(cache){
		if(endPjaxTimer){
			clearTimeout(endPjaxTimer);
			endPjaxTimer = 0;
		}
		S.one('.loading').hide();
		li.removeClass('current-menu-item');
		li.each(function(el){
			var href = S.all('a', el).attr('href'), h;
			href = S.pjax.util.getRealUrl(href);
			h = S.pjax.util.getRealUrl(location.href);
			if(href == h || (href+'/') == h || href == (h+'/')){
				S.one(el).addClass('current-menu-item');
				return false;
			}
		});
		typeof pjaxCallback != 'undefined' && pjaxCallback && pjaxCallback();

		removeStorageCache();
	});
	S.pjax({
		selector: 'a',
		container: '#content',
		show: typeof pjaxFx == 'undefined' ? '' : pjaxFx,
		cache: typeof pjaxCacheTime == 'undefined' ? true : pjaxCacheTime,
		storage: typeof pjaxUseStorage == 'undefined' ? true : pjaxUseStorage,
		titleSuffix: pjaxTitleSuffix,
		filter: function(href){
			if(href.indexOf('feed')> -1 ||href.indexOf('wp-login.php')> -1 || href.indexOf(pjaxHomeUrl) != 0 || href.indexOf('wp-content/') > -1 || href.indexOf('wp-admin/') > -1|| href.indexOf('/lab/') > -1){
				return true;
			}
		}
	})
	//remove current href cache when a comment added.
	function removeStorageCache(){
		if(S.one('#commentform')&& S.one('#commentform').length){
			S.Event.on('#commentform', 'submit',function(){
				var href = location.href.replace(/\/comment\-page.*/, '');
				S.pjax.util.removeCache(href);
			})
		}
	}
	removeStorageCache();
})