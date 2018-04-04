(function(mui) {
	editCartNumber ('#carPage .mui-badge');
	mui('.mui-bar').on('tap','#homePage',function(){
	    window.location.href = './index.html'
	});
	mui('.mui-bar').on('tap','#Categories',function(){
	    window.location.href = './all-categorys.html?categoryid=0'
	});
	mui('.mui-bar').on('tap','#Guide',function(){
	    window.location.href = './article-list.html'
	});
	mui('.mui-bar').on('tap','#carPage',function(){
		isLogin('cart.html','cart');
	});
	mui('.mui-bar').on('tap','#mePage',function(){
		isLogin('me.html','me')
	});
	mui('.mui-bar').on('tap','#morePage',function(){
	    window.location.href = './more.html'
	});

	// 获取购物车数量
	function editCartNumber (dom) {
		var token = window.localStorage.getItem('token');
		$.ajax({
			beforeSend: function(request) {
	            request.setRequestHeader("TOKEN", token);
	        },
			url: csOrzs + '/Api/Cart/getAmount',
			type: 'POST',
		})
		.done(function(data) {
			if (data.code==1) {
				if (data.data.amount != 0) {
					$(dom).html(data.data.amount);
				}
			} else {
				// mui.toast("请求数据错误！");
				// 
			}
			
		})
		.fail(function() {
			// mui.toast("请求数据错误！");
		});
	}


	function isLogin(page,flag) {
		var token = window.localStorage.getItem('token') || null;
		console.log(token);
		if (!token || token == "undefined" || token == "null") {
			window.location.href = './login.html?flag=' + flag;
		} else {
			window.location.href = '../'+ page;
			// console.log(page);
		}
	}

	
})(mui);