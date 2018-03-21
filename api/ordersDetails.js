(function(mui) {
	var clipboard = new Clipboard('.copybtn');
	var flag = getQueryString('flag');
	var orderid = getQueryString('orderid');
	var content_status = getQueryString('content_status');
	
	 	
	var info = GetRequest();
		delete info.flag;
		delete info.orderid;
		delete info.content_status;
		
	// console.log(arr)
	
	console.log(info);
	getdata (info,orderid,content_status);
	showpage ();
	function showpage () {
		if (flag == 0) {
			$('.one').show();
		} else if (flag == 1) {
			
			$('.one').show();
			$('.two').show();
			$('.three').show();
		} else if (flag == 3) {
			$('.one').show();
			$('.two').show();
			$('.three').show();
		}
	}
	clipboard.on('success', function(e) {
	    mui.toast('Successfully!');
	    e.clearSelection();
	});
	clipboard.on('error', function(e) {
	    mui.toast('Error!');
	});
	if (flag == 3) {
		$('#refundBtn').show()
	} else if (flag == 1) {
		$('#payBtn').show();
	}

	$('#payBtn').on('click',function(){
        var ua = window.navigator.userAgent.toLowerCase(); 
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
            window.location.href = 'http://page.thatsmags.com/WebAccess/get-weixin-code.html?appid=wx06e97f4ed4ac07e3&scope=snsapi_base&state=STATE&redirect_uri=http%3A%2F%2F'+ csOrzs2 +'%2FApi%2FCommon%2Findex%3Forderid='+ orderid;
        } else { 
            window.location.href = './payment-method2.html?orderid='+orderid;
        } 
	});
	$('body').on('click', '.gorunfundbtn', function(event) {
		var flagid = $(this).attr('flagid');
		window.location.href = './refund.html?flagid=' + flagid;
	});

	function getdata (info,orderid,content_status) {
		var token = localStorage.getItem("token"); 
		$.ajax({
			beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
			url: csOrzs + '/Api/Order/getOrder',
			type: 'POST',
			data: {
				price_array: info,
				order_id: orderid,
				status: content_status
			},
		})
		.done(function(data) {
			console.log(data);
			if (data.code == 0) {
				mui.toast("Network error, please try again!");
			} else {
				localStorage.setItem('token',data.data.token);
				var address = data.data.order.address;
				if (flag == 2 || flag == 3) {
					var param = data.data.order.merchant[0].param;
	            	var scriptInsert = "<script type='text/javascript' src='https://webchat.7moor.com/javascripts/7moorInit.js?accessId="+ param +"&autoShow=false&language=ZHCN' async='async'></script>";
	            	$("body").append($(scriptInsert));
	            	$('.mui-icon.icon-kefu').show();
				}
				
				// 地址、邮箱
				if (content_status == 1) {
					var emaiHtml = template('emailtemplate', address);
					$('#addrinfo').html(emaiHtml);
				} else if (content_status == 2) {
					var addrHtml = template('addrtemplate', address);
					$('#addrinfo').html(addrHtml);
				}

				// 商品列表栏
				var proinfo = data.data.order;
				if (flag == 3) {
					proinfo.flag = 3;
				}
				console.log(proinfo);	
				var prolist2 = {"prolist":proinfo};
				var prolistHtml = template('producttemplate', prolist2);
				$('#probox').html(prolistHtml);


				// 购买时间、到货时间以及订单号
				var ordertimeinfo = data.data.order;
				var ordertimeinfoHtml = template('bottomtemplate', ordertimeinfo);
				$('#bottombox').html(ordertimeinfoHtml);
			}
		})
		.fail(function() {
			mui.toast("Network error, please try again!");
		});
		
	}
	// 获取地址栏参数
	function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }     
        return null;
    }
    
    // 获取订单数量
    function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
	var str = url.substr(1);
	strs = str.split("&");
	for(var i = 0; i < strs.length; i ++) {
		   		theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
			}
	}
		return theRequest;
	}
})(mui);

