(function(mui) {
	mui.init({
		swipeBack:true //启用右滑关闭功能
	});

    var proObj = JSON.parse(getQueryString("proarr"));
    var status = getQueryString("status");
    var payArr = getQueryString("payArr") || '';
    var deleteArr = payArr.split(",");
    console.log(deleteArr);
    getData ();
    function getData () {
        var token = window.localStorage.getItem('token');
        $.ajax({
            // 请求网址
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
            url: csOrzs + '/Api/Order/getOrder',
            type: 'POST',
            data: {price_array: proObj,status:status},
        })
        .done(function(data) {
            console.log(data);
            if (data.code == 1) {
                window.localStorage.setItem('token',data.data.token);
                var orderEmailHtml = template("orderEmailTemplate",data.data.order);
                $('#databox').html(orderEmailHtml);
            } else {
                mui.toast("Network error, please try again!");
            }
        })
        .fail(function() {
            mui.toast("Network error, please try again!");
        });
        
    }

    $('#databox').on('click', '#changeEmail', function(e) {
       $defaultText = $('#emailText').html();
        // e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
        var btnArray = ['Cancel', 'Done'];
        mui.prompt('Change the email address', 'Email  address', ' ', btnArray, function(e) {
            if (e.index == 1) {
                if (e.value.length==0) {
                    mui.toast("Please enter your email address!");
                    return false;
                } else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(e.value)) {
                    mui.toast("Please enter a valid email address!");
                    return false;
                } else {
                    $('#emailText').html(e.value);
                    mui.toast("Successfully!");
                }
            } else {
                
            }
        })
    });
    $('#databox').on('click', '.submit', function(e) {
        var email = $('#emailText').text();
        var token = window.localStorage.getItem('token');
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
            url: csOrzs + '/Api/Order/mkOrder',
            type: 'POST',
            data: {
                    price_array: proObj,
                    address_id: null,
                    email: email,
                    cart_array: deleteArr
                },
        })
        .done(function(data) {
            if(data.code == 1) {
                // mui.toast("Network error, please try again!");
                window.localStorage.setItem('token',data.data.token);
                var orderid = data.data.order_id;
                is_weixin();
                function is_weixin() { 
                    var ua = window.navigator.userAgent.toLowerCase(); 
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
                        window.location.href = 'http://page.thatsmags.com/WebAccess/get-weixin-code.html?appid=wx06e97f4ed4ac07e3&scope=snsapi_base&state=STATE&redirect_uri=http%3A%2F%2F'+ csOrzs2 +'%2FApi%2FCommon%2Findex%3Forderid='+ orderid;
                    } else { 

                        window.location.href = './payment-method2.html?orderid='+orderid;
                    } 
                }
            } else if (data.code == 0) {
                mui.toast("Low stocks!");
            } else {
                mui.toast("Network error, please try again!");
            }
        })
        .fail(function() {
            // mui.toast("请求数据失败");
        })
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