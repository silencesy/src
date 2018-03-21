(function(mui) {


	loading();
	mui('body').on('tap','a',function(){document.location.href=this.href;});
	function imgLazyLoad() {
		$("img.lazy").lazyload({ 
			effect : "fadeIn",
			placeholder: "http://api.mall.thatsmags.com/Public/ckfinder/images/grey.jpg"
		}); 
	}

	function loading() {
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				// down: {
				// 	contentdown : "Pull down to refresh",
				// 	contentover : "Release to refresh",
				// 	contentrefresh : "Loading…",
				// 	callback: pulldownRefresh
				// },
				up: {
					auto:true,
					contentrefresh : "Loading…",
					callback: pullupRefresh
				}
			}
		});
		var page = 0;
		function pullupRefresh() {
			++page;
			$.ajax({
				url: csOrzs +  '/Api/Set/getList',
				type: 'GET',
				data: {
                		pageSize: 8,
                		p: page,
                		set_position: 5
                	},
			})
			.done(function(response) {
				if (response.code == 1) {
					var shopListData = response;
					var totalPages = shopListData.data.totalPages;
               		mui('#pullrefresh').pullRefresh().endPullupToRefresh((page == totalPages));
                    
                    var shopArr = shopListData.data.merchant;
					var shopsList2 = {"shopsList":shopArr};
					var shopsListHtml = template('shops', shopsList2);
					$('#listdata').append(shopsListHtml);
					imgLazyLoad();
                       
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					mui.toast("Network error, please try again!");
				}
				
			})
			.fail(function() {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				mui.toast("Network error, please try again!");
			});
		}
	}
})(mui);