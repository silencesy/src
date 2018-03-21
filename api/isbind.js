$(function() {

	// var countdown=60;
	var isBind = getQueryString("isBind");
	var source = getQueryString("source");
	// var phoneNumber = getQueryString("phoneNumber");

	var mobile = getQueryString('mobile');
	var openid = getQueryString('openid');
	var head_img = getQueryString('head_img');
	var sex = getQueryString('sex');
	var city = getQueryString('city');
	var goback = getQueryString('state');

	console.log(mobile, openid+'1111', head_img+'222', sex+'333', city+'444');
	wechatBind();
	// mobileBind ();
	// getcode ();
	// isBindEmail ();


	// 是否绑定并判断注册来源 显示不同弹出层
	// function isBindEmail () {

	// 	if (source == 1) {
	// 		$('#mobile-bind').show();
	// 	} else if (source == 0 ) {
	// 		$('#wechat-bind').show();
	// 	}
	// }

	// 微信注册绑定
	function wechatBind() {

		mui('#loginBtn')[0].addEventListener('tap', function() {
			var email = $.trim($("#emailtext1").val());
			// var phoneNumber = getQueryString("phoneNumber");
			var username = document.getElementById('name').value;
			var password = document.getElementById('password').value;
			var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
			// var username = getQueryString("nickname");
			// var openid = getQueryString("openid");
			// var sex = getQueryString("sex");
			// var city = getQueryString("city");
			// var headimgurl = getQueryString("headimgurl");
			$('.home-mask input').each(function(index, el) {
				$(this).blur();
			});
			if (!email) {
				mui.toast("Please enter your email address!");
				return false;
			} else if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
				mui.toast("Please enter a valid email address!");
				return false;
			}
			if (username == '') {
				mui.toast("Please enter your name!");
				return false;
			}
			if (password == '') {
				mui.toast("Please enter your password!");
				return false;
			} else if (!reg.test(password)) {
				mui.toast(" Please enter your password with 6-16 digits (must contain numbers and letters)!",{ duration:'long', type:'div' });
				return false;
			}

			$.ajax({
					url: csOrzs + '/Api/Account/thirdBind',
					type: 'POST',
					dataType: 'json',
					data: {
						mobile: mobile,
						email: email,
						password: password,
						// code: code,					
						openid: openid,
						username: username,
						head_img: head_img,
						sex: sex,
						city: city
					},
				})
				.done(function(data) {
					var data = data;
					var token = data.data.token;

					
					if (data.code == 1) {
						localStorage.setItem("token",token);
						window.location.href = goback;
					} else {
						mui.toast("Network error, please try again!");
					}
				})
				.fail(function() {
					mui.toast("Network error, please try again!");
				})

		});
	}

	// 手机注册绑定
	// function mobileBind () {
	// 	mui('.login-btn').on('tap','#loginBtn2',function(){
	//         var email = $.trim($("#emailtext").val());
	// 		var phoneNumber = getQueryString("phoneNumber");
	// 		console.log(email,phoneNumber);
	// 		$('.home-mask input').each(function(index, el) {
	// 			$(this).blur();
	// 		});
	// 		if (!email) {
	// 			mui.toast("Please enter your email address!");
	// 			return false;
	// 		} else if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
	// 			mui.toast("Please enter a valid email address!");
	// 			return false;
	// 		} 
	// 		$.ajax({
	// 			url: 'http://proj7.thatsmags.com/Api/Account/mbBind',
	// 			type: 'POST',
	// 			dataType: 'json',
	// 			data: {mobile: phoneNumber,email: email},
	// 		})
	// 		.done(function(data) {
	// 			console.log(data);
	// 			if (data.message == "mobile_bind_success") {
	// 				var token = data.data.token;
	// 				localStorage.setItem("token",token);
	// 				window.location.href = './me.html';
	// 			} else {
	// 				mui.toast("Network error, please try again!");
	// 			}
	// 		})
	// 		.fail(function() {
	// 			mui.toast("Network error, please try again!");
	// 		});
	//    	});
	// }


	// function getcode () {
	// 	getCode.addEventListener('tap',function(){
	// 		var phoneNumber = document.getElementById('phoneNumber').value;
	// 		var code = document.getElementById('code').value;
	// 		if (!phoneNumber) {
	// 			mui.toast('Please enter your number!');
	// 			return;
	// 		} else if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
	// 			mui.toast("Please enter a 11-digit valid number!");
	// 			return;
	// 		}	
	// 		settime(this);
	// 		$.ajax({
	// 			url: 'http://proj7.thatsmags.com/Api/Public/mobileCode',
	// 			type: 'POST',
	// 			dataType: 'json',
	// 			data: {mobile: phoneNumber},
	// 		})
	// 		.done(function(data) {
	// 			var data = data;
	// 			if (data.data == 107) {
	// 				mui.toast("Please enter a 11-digit valid number!");
	// 				return false;
	// 			}
	// 			if (data.data == 109) {
	// 				mui.toast("Frequent operation, please try again later!");
	// 				return false;
	// 			}
	// 		})
	// 		.fail(function() {
	// 			mui.toast("Network error, please try again!");
	// 		});


	// 	});
	// }



	// 微信授权获取信息
	// function getWeChatInfo () {
	// 	var userCode = getQueryString("code") || null;
	// 	if (userCode) {
	// 		$.ajax({
	// 			url: 'http://proj7.thatsmags.com/Api/Account/thirdLogin',
	// 			type: 'POST',
	// 			dataType: 'json',
	// 			data: {code: userCode}
	// 		})
	// 		.done(function(data) {
	// 			// alert(JSON.stringify(data));
	// 			var data = data;
	// 			var isBind = data.data.is_bind;
	// 			if (isBind == 0) {
	// 				var source = data.data.source;
	// 				var openid = data.data.user_data.openid;
	// 				var nickname = data.data.user_data.nickname;
	// 				var sex = data.data.user_data.sex; 
	// 				var city = data.data.user_data.city; 
	// 				var headimgurl = data.data.user_data.headimgurl;
	// 			}
	// 			if (isBind == 1) {
	// 				var token = data.data.token;
	// 				localStorage.setItem("token",token);	
	// 				return false;
	// 			} else if (isBind == 0) {
	// 				sessionStorage.setItem("isBind",isBind);
	// 				sessionStorage.setItem("source",source);
	// 				sessionStorage.setItem("openid",openid);
	// 				sessionStorage.setItem("nickname",nickname);
	// 				sessionStorage.setItem("sex",sex);
	// 				sessionStorage.setItem("city",city);
	// 				sessionStorage.setItem("headimgurl",headimgurl);
	// 				isBindEmail ();
	// 				return false;

	// 			}
	// 		})
	// 		.fail(function() {
	// 			mui.toast("数据请求失败，稍后再试!");
	// 		})


	// 	}
	// }

	// 短信获取倒计时
	// function settime(obj) {   
	// 	if (countdown == 0) {   
	// 	    obj.removeAttribute("disabled");  
	// 	    obj.style.backgroundColor = "#fc4002";  
	// 	    obj.style.color = "#fff"; 
	// 	    obj.innerText="Send code";   
	// 	    countdown = 60;   
	// 	    return;  
	// 	} else {   
	// 	    obj.setAttribute("disabled", true);
	// 	    obj.style.backgroundColor = "#6A6A6A"; 
	// 	    obj.style.color = "#fff";   
	// 	    obj.innerText = countdown+ "s";   
	// 	    countdown--;   
	// 	}   
	// 	setTimeout(function() {   
	// 	    settime(obj);
	// 	},1000);
	// } 

	// 获取地址栏参数
	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}

})