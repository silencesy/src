var locurl = window.location.host;
var csOrzs = '';
if (locurl == 'mob.thmart.com.cn') {
	csOrzs = 'http://api.mall.thatsmags.com';
} else {
	csOrzs = 'http://proj7.thatsmags.com';
}

var csOrzs2 = csOrzs.slice(7,csOrzs.length);
// 设置token
setToken ();
function setToken () {
	var token = getQueryString('token') || "";
	if (token) {
		localStorage.setItem("token",token);
	}
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