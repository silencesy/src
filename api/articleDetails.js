(function(mui) {
    mui.init();
    var articleId = getQueryString('articlesid') || 1;
    $.ajax({
    	url: csOrzs + '/Api/Article/getDetail',
    	type: 'POST',
    	data: {id: articleId}
    })
    .done(function(data) {
    	var detailsdata = data; 
    	console.log(detailsdata);
    	if (detailsdata.code == 1) {
    		var detailsInfo = detailsdata.data;
            $('title').html(detailsInfo.article.article_name);
    		$('#articleTextBox .art-title .title').html(detailsInfo.article.article_name);
    		$('#articleTextBox .art-title .time').html(detailsInfo.article.create_time);
    		$('#articleTextBox .art-content').html(detailsInfo.article.article_content);
    		var recommendData = detailsdata.data.list;
    		var recommendList2 = {"recommendList":recommendData};
    		var ecommendHtml = template('recommend',recommendList2);
    		$('#recommendBox').html(ecommendHtml);
    	}
    })
    .fail(function() {
    	console.log("error");
    });
    // 获取地址栏参数
	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
			return null;
	}
    
})(mui);