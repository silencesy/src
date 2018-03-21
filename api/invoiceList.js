(function(mui) {
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
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
        var token = window.localStorage.getItem('token');
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
            url: csOrzs + '/Api/Invoice/getList',
            type: 'GET',
            data: {
                    'pageSize': 1,
                    'p': page,
                },
        })
        .done(function(response) {
            if (response.code == 1) {
                window.localStorage.setItem('token',response.data.token);
                var totalPages = response.data.totalPages;
                mui('#pullrefresh').pullRefresh().endPullupToRefresh((page == totalPages || totalPages==0));
                var invoiceData = response.data.list;
                var invoicelist2 = {"invoiceList":invoiceData};
                var invoiceListHtml = template("invoiceTemplate",invoicelist2);
                $('#listdata').append(invoiceListHtml);
                
                
                
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

	var btnArray = ['Confirm', 'Cancel'];
	mui('.data-list').on('tap', '.delete', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
        var invoiceid = $(elem).attr('invoiceid');
		console.log(li);
		mui.confirm('Are you sure to delete this record?', ' ', btnArray, function(e) {
			if (e.index == 0) {
				$(elem).parents('.add-list').remove();
                var token  = window.localStorage.getItem('token');
				$.ajax({
                    beforeSend: function(request) {
                        request.setRequestHeader("TOKEN", token);
                    },
                    url: csOrzs + '/Api/Invoice/deleteInvoice',
                    type: 'POST',
                    data: {invoice_id: invoiceid},
                })
                .done(function(data) {
                    if (data.code == 1) {
                        window.localStorage.setItem("token",data.data.token);
                        mui.toast("successfully!");
                    } else {
                        mui.toast("Failed to delete!");
                    }
                })
                .fail(function() {
                    mui.toast("Failed to delete!");
                })
			} else {
				
			}
		});
	});

    $('#listdata').on('click', 'input', function(event) {
        var invoiceid = $(this).attr('invoiceid');
        var token = window.localStorage.getItem("token");
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
            url: csOrzs + '/Api/Invoice/editDefault',
            type: 'POST',
            data: {invoice_id: invoiceid},
        })
        .done(function(data) {
                console.log(data);
            if (data.code == 1) {
                window.localStorage.setItem("token",data.data.token);
                // mui.toast("请求数据失败！");
            } else {
                mui.toast("Error!");
            }
        })
        .fail(function() {
            mui.toast("Error!");
        })
    });

    mui('body').on('tap','.edit',function(){
        var invoiceid = $(this).attr('invoiceid');
        window.location.href = './edit-invoice.html?invoiceid='+ invoiceid;
    });
    mui('body').on('tap','.address-btn',function(){document.location.href=this.href;});

})(mui);