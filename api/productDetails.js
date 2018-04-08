(function(mui) {
	var merchantsid;
	mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	editCartNumber ('.mui-badge');
	mui.previewImage();
	$('#productInfo').on('click', 'a', function(event) {
		window.location.href = $(this).attr('href');
	});
	h('#goCartLogo').tap(function(){
		var token = window.localStorage.getItem('token');
		if (token == '' || token == undefined) {
			window.location.href= "../login.html";
		} else {
			window.location.href= "./cart.html";
		}
		
	});
	h('#readMore').tap(function(){
		window.location.href= this.href;
	});
	$('#goShop').on('click',function() {
		window.location.href = '../shopOwner-home.html?merchantsid=' + merchantsid;
	})
	h('#chooseColor').tap(function(){
		h('#maskToPay').hide();
		h('#maskAddTo').hide();
		h('#maskAddPay').show();
		productChoosemask();
	});
	h('#addTo').tap(function(){
		h('#maskToPay').hide();
		h('#maskAddPay').hide();
		h('#maskAddTo').show();
		productChoosemask();
	});
	h('#toPay').tap(function(){
		
		h('#maskAddPay').hide();
		h('#maskAddTo').hide();
		h('#maskToPay').show();
		productChoosemask();
	});

	// 加入购物车
	h('#addCartBtn').tap(function(){
		addCart () ;
		closeMask ();
	});



	h('#addCartBtn2').tap(function(){
		addCart ();
		closeMask ();
	});

	function addCart () {
		var productNumber = h('#productNumber').val();
		var token = localStorage.getItem('token');
		var priceid =$('#buyProductId').attr('priceid');
		$.ajax({
			beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
			url: csOrzs + '/Api/Cart/addCart',
			type: 'POST',
			data: {
				price_id: priceid,
				goods_cnt: productNumber
			},
		})
		.done(function(data) {
			console.log(data);
			if (data.code == 1) {
				localStorage.setItem('token',data.data.token);
				mui.toast('Successfully!');
				editCartNumber ('.mui-badge');
			} else {
				window.location.href = './login.html';
			}
		})
		.fail(function() {
			mui.toast('Error!');
		});
		
		console.log(productNumber,token,priceid)
		
	}

	// 购买
	h('#toPayBtn').tap(function(){
		closeMask ();
		goBuy ();
	});
	h('#toPayBtn2').tap(function(){
		closeMask ();
		goBuy ();
	});

	function goBuy () {
		var productNumber = h('#productNumber').val();
		var priceid =$('#buyProductId').attr('priceid');
		var token = window.localStorage.getItem("token");
		var proObjString = '{"' + priceid + '":"' + productNumber + '"}';
		$.ajax({
			beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
			url: csOrzs + '/Api/Cart/judgeOrderFromGoods',
			type: 'POST',
			data: {price_id: priceid},
		})
		.done(function(data) {
			if (data.code == 1) {
				localStorage.setItem('token',data.data.token);
				if (data.data.status == 1) {
					window.location.href = './order-confirm-email.html?proarr=' + proObjString + '&status=1';
				}

				if (data.data.status == 2) {
					window.location.href = './order-confirm-addr.html?proarr=' + proObjString + '&status=2';
				}

			} else {
				window.location.href = './login.html';
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	}

	// 点击关闭按钮关闭弹出层
	$('#chooseTem').on('click', '#closeChoose', function(event) {
		event.preventDefault();
		closeMask ();
	});

	// 点击遮罩层关闭弹出层
	h('#detailMask').tap(function(){
		closeMask ();
	});

	// 关闭弹出层
	function closeMask () {
		h('#detailMask').hide();
		h('#chooseInfo').css({"bottom":'-1500px'});
	}
	mui('#chooseTem').on('tap',".product-class-list1 .leixing",function(){
		var that = this;
		$(that).parents('.product-class-list').find('span').each(function(index, el) {
			$(this).removeClass('active');
		});
		$(that).addClass('active');
		getProChooseInfo (that);
	})

	mui('#chooseTem').on('tap',".product-class-list2 .leixing",function(){
		var that = this;
		$(that).parents('.product-class-list').find('span').each(function(index, el) {
			$(this).removeClass('active');
		});
		$(that).addClass('active');
		getProChooseInfo ();
	})

	function productChoosemask() {
	// 弹出选择信息
		h('#detailMask').show();
		h('#chooseInfo').css({"bottom":0});
	}

	mui('.sub-add').on('tap','.sub',function(){
        var n = this.nextElementSibling.value || 2;
        console.log(n);
		var num = parseInt(n)-1;
        if (num == 1) {
           this.style.color = "#D5D5D5";
        }
		if(num==0){
            return;
        }
		this.nextElementSibling.value = num;
		return false;

    });

    mui('.sub-add').on('tap','.add',function(){
        this.previousElementSibling.previousElementSibling.style.color = "#222";
	 	var n = this.previousElementSibling.value || 1;
	 	var num=parseInt(n)+1;
	 	this.previousElementSibling.value = num;
	 	return false;
    });

    h('#commentbtn').tap(function(){
    	window.location.href = this.href;
    });

    

    // 获取页面数据
    var productId = getQueryString("productid");
	$.ajax({
		url: csOrzs + '/Api/Archive/getDetail',
		type: 'GET',
		data: {id: productId},
	})
	.done(function(data) {
		var productsData = data;
		// console.log(productsData);
		if (data.code==1) {
			var param = productsData.data.param;
            var scriptInsert = "<script type='text/javascript' src='https://webchat.7moor.com/javascripts/7moorInit.js?accessId="+ param +"&autoShow=false&language=ZHCN' async='async'></script>";
            $("body").append($(scriptInsert));
			$('title').text(data.data.goods_name);
			
			// 轮播图
			var productFigure = productsData.data.figure;
			var productCarouselList2 = {"productCarouselList":productFigure};
			var productFigureHtml = template('productCarousel', productCarouselList2);
			$('#productFigureBox').html(productFigureHtml);
			detailCarouselFunction();

			var productInfoHtml = productsData.data.goods_content;
			merchantsid = productsData.data.merchant_id;
			// 商品内容
			$("#productInfo").html(productInfoHtml);

			// 商品分类列表
			var productChooseData = productsData.data;
			var productChooseHtml = template('chooseTemplate', productChooseData);
			$('#chooseTem').html(productChooseHtml);


			// // 商品参数信息
			var productParameterData = productsData.data;
			var productParameterHtml = template('productParameter', productParameterData);
			$('#productParameterBox').html(productParameterHtml);
			// console.log(productsData.data.eticket);
			if(productsData.data.eticket != 1) {
				$('.prompt-info').show();
			}
			imgLazyLoad();
		} else {
			mui.toast("Network error, please try again!");
		}
	})
	.fail(function() {
		mui.toast("Network error, please try again!");
	});

	h('#saveProduct').tap(function(){
		if (h('.save-icon').hasClass('activesave')) {
			Collection (0,productId,1,"Save failed!");
		} else {
			Collection (1,productId,1,"Successfully!");
		}
	});

	function Collection (isnot,id,shoporpro,info) {
		var token = window.localStorage.getItem('token');
		console.log(token,isnot,id,shoporpro,info);
		$.ajax({
			beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
			url: csOrzs + '/Api/Collect/userCollect',
			type: 'POST',
			data: {
				status: isnot,
				content_id: id,
				content_type: shoporpro,
			},
		})
		.done(function(data) {
			console.log(data);
			if (data.code == 1) {
				if (isnot == 0) {
					h('.save-icon').removeClass('activesave');
				} else {
					h('.save-icon').addClass('activesave');
				}
				mui.toast(info);
			} else {
				window.location.href = './login.html';
			}
		})
		.fail(function() {
			mui.toast("Network error, please try again!");
		})		
	}

	function imgLazyLoad() {
		$("img.lazy").lazyload({ 
			effect : "fadeIn",
			threshold: 200,
			placeholder: csOrzs + "/Public/ckfinder/images/lazyimg/lazy.jpg"
		}); 
	}


	function getProChooseInfo (that) {
		var types1;
		var types2;
		$('#chooseTem .product-class-list1 span').each(function(index, el) {
			if ($(this).hasClass("active")) {
				types1 = $(this).text();
			}
		});
		$('#chooseTem .product-class-list2 span').each(function(index, el) {
			if ($(this).hasClass("active")) {
				types2 = $(this).text();
			}
		});
		var productId = getQueryString("productid");
		$.ajax({
			url: csOrzs + '/Api/Archive/getOnePrice',
			type: 'GET',
			data: {
				id: productId,
				goods_type_one: types1,
				goods_type_two: types2
			},
		})
		.done(function(data) {
			if (data.code === 1) {
				
				var changeData = data.data;
				console.log(changeData);
				var chageDataHtml = template('changeInfo', changeData);
				$('#default').html(chageDataHtml);
			} else {
				mui.toast("Network error, please try again!");
			}
		})
		.fail(function() {
			mui.toast("Network error, please try again!");
		})
		
	}

	function  detailCarouselFunction () {
		var detailCarousel = new Swiper('.detail-banner-carousel',{
			autoplay: 4000,
			speed: 1000,
			autoplayDisableOnInteraction: false,
			paginationClickable :true,
			pagination : '.swiper-pagination',
			paginationType : 'fraction'				
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
			}
			
		})
		.fail(function() {
			// mui.toast("请求数据错误！");
			// 
		});
	}
	// wechatShare ();
	// // 微信分享
	// function wechatShare () {
	// 	$.ajax({
	// 		url: csOrzs + '/Api/Wx/wxShare',
	// 		type: 'POST',
	// 		async: false,
	// 		data: {goods_id: productId},
	// 	})
	// 	.done(function(data) {
	// 		// console.log(data);
	// 		share (data.data);
	// 	}).fail(function() {
	// 		mui.toast("Network error, please try again!");
	// 	});
		
	// }

	// function share (data) {
	// 	wx.config({
	// 	debug:false,// 是否开启调试模式
	// 	appId:data.signPackage.appId,// 必填，微信号AppID
	// 	timestamp:String(data.signPackage.timestamp),// 必填，生成签名的时间戳
	// 	nonceStr:data.signPackage.nonceStr,// 必填，生成签名的随机串
	// 	signature:data.signPackage.signature,// 必填，签名，见附录1
	// 	jsApiList:['onMenuShareTimeline',//分享到朋友圈
	// 	         'onMenuShareAppMessage',//分享给朋友
	// 	         'onMenuShareQQ'//分享到QQ
	// 	        ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	// 	});
	// 	wx.ready(function(){
	// 		var url = window.location.href;
	// 		var url2 = url.replace("&from=singlemessage&isappinstalled=0","");
	// 		alert(url2);
	// 		var options ={
	// 			title:data.res.title,// 分享标题
	// 			link:encodeURI(url2),// 分享链接，记得使用绝对路径
	// 			imgUrl:encodeURI(data.res.imgUrl),// 分享图标，记得使用绝对路径
	// 			desc:data.res.desc,// 分享描述
	// 			success:function(){
	// 			  console.info('分享成功！'); 
	// 			  // 用户确认分享后执行的回调函数
	// 			},
	// 			cancel:function(){
	// 			  console.info('取消分享！');
	// 			  // 用户取消分享后执行的回调函数
	// 			}
	// 		}
	// 		wx.onMenuShareTimeline(options);// 分享到朋友圈
	// 		wx.onMenuShareAppMessage(options);// 分享给朋友
	// 		wx.onMenuShareQQ(options);// 分享到QQ
	// 		wx.error(function (res) {    
	//             alert("error: " + res.errMsg);    
	//         });
 //        }); 
	// }
})(mui);