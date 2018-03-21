(function(mui) {
    loading ();
    function loading () {
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
                url: csOrzs + '/Api/Address/getList',
                type: 'GET',
                data: {
                        'pageSize': 8,
                        'p': page,
                    },
            })
            .done(function(response) {
                var arrListData = response;
                console.log(arrListData);
                if (arrListData.code == 1) {
                    window.localStorage.setItem('token',arrListData.data.token);
                    var totalPages = arrListData.data.totalPages;
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh((page == totalPages || totalPages==0));
                    var addrListData = arrListData.data.list;
                    var addrList2 = {"addrList":addrListData};
                    var addrListDataHtml = template('addrTemplate', addrList2);
                    $('#listdata').append(addrListDataHtml);
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
        $('#listdata').on('click', 'input', function(event) {
            var addrid = $(this).attr('addrid');
            var token = window.localStorage.getItem("token");
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("TOKEN", token);
                },
                url: csOrzs + '/Api/Address/editDefault',
                type: 'POST',
                data: {address_id: addrid},
            })
            .done(function(data) {
                    console.log(data);
                if (data.code == 1) {
                    window.localStorage.setItem("token",data.data.token);
                    // mui.toast("请求数据失败！");
                } else {
                    mui.toast("Failed to set the default address!");
                }
            })
            .fail(function() {
                mui.toast("Failed to set the default address!");
            })
        });
        mui('body').on('tap','.edit',function(){
            var addrid = $(this).attr('addrid');
            window.location.href = './edit-addr.html?addrid=' + addrid;
        });
        mui('body').on('tap','.address-btn',function(){document.location.href=this.href;});
        var btnArray = ['Confirm', 'Cancel'];
        mui('.data-list').on('tap', '.delete', function(event) {
            var elem = this;
            var li = elem.parentNode.parentNode;
            console.log(li);
            mui.confirm('Are you sure to delete？', ' ', btnArray, function(e) {
                if (e.index == 0) {
                    var token = window.localStorage.getItem("token");
                    var addressId = $(elem).attr('addrid');
                    $.ajax({
                        beforeSend: function(request) {
                            request.setRequestHeader("TOKEN", token);
                        },
                        url: csOrzs + '/Api/Address/deleteAddress',
                        type: 'POST',
                        data: {address_id: addressId},
                    })
                    .done(function(data) {
                        console.log(data);
                        if (data.code == 1) {
                            $(elem).parents('.add-list').slideUp('fast');
                            mui.toast('Deleted successfully!');
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
    }
})(mui);