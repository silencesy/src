(function(mui) {

	getData ();
	submit() ;

	function getData () {
		var invoiceid = getUrlParam('invoiceid');
		var token = window.localStorage.getItem('token');
		$.ajax({
			beforeSend: function(request) {
	            request.setRequestHeader("TOKEN", token);
	        },
			url: csOrzs + '/Api/Invoice/getOne',
			type: 'POST',
			data: {invoice_id: invoiceid},
		})
		.done(function(data) {
			if (data.code == 1) {
					window.localStorage.setItem('token',data.data.token);
					var invoiceHtml = template("editInvoiceTemplate",data.data.invoice);
					$("#editInvoiceBox").html(invoiceHtml);
				} else {
					mui.toast("Error!");
				}
		})
		.fail(function() {
			mui.toast("Error!");
		})
	}

	function submit() {
		var invoiceid = getUrlParam('invoiceid');
		var subto = document.getElementById('subto');
		subto.addEventListener('tap',function() {
			/*验证税号 15或者17或者18或者20位字母、数字组成*/
			var tel = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
			var name = document.getElementById('name').value;
			var theTextarea = document.getElementById('textarea').value;
			var theNumber = document.getElementById('number').value;
			if(name == '') {
				mui.toast('Please enter your company name!');
				return false
			}else if(theTextarea == '') {		
				mui.toast('Please enter your company address!');
				return false
			}else if(!tel.test(theNumber)) {
				mui.toast('Please enter a right tax number!');
				return false
			}
			var token = window.localStorage.getItem('token');
			console.log(token);
			$.ajax({
				beforeSend: function(request) {
	                request.setRequestHeader("TOKEN", token);
	            },
				url: csOrzs + '/Api/Invoice/editInvoice',
				type: 'POST',
				data: {
					invoice_id: invoiceid,
					company_name: name,
					tax: theNumber,
					region: theTextarea
				},
			})
			.done(function(data) {
				console.log(data);
				if (data.code == 1) {
					window.localStorage.setItem('token',data.data.token);
					window.location.href = './invoice-list.html';
				} else {
					mui.toast("Error!");
				}
				
			})
			.fail(function() {
				mui.toast("Error!");
			})
		});
	}

	


	function getUrlParam(key){
        // 获取参数
        var url = window.location.search;
        // 正则筛选地址栏
        var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
        // 匹配目标参数
        var result = url.substr(1).match(reg);
        //返回参数值
        return result ? decodeURIComponent(result[2]) : null;
    }
})(mui);
