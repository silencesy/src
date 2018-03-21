(function(mui) {

    mui.init({
        swipeBack:true //启用右滑关闭功能
    });

    var proObj = JSON.parse(getQueryString("proarr"));
    var status = getQueryString("status");
    var payArr = getQueryString("payArr") || '';
    var deleteArr = payArr.split(",");
    console.log(deleteArr);
    var flag = 0;
    console.log(proObj);
    clickList ();
    addAddr();
    getData ();

    // 获取订单列表
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
                var orderEmailHtml = template("addrTemplate",data.data.order);
                $('#bigbox').html(orderEmailHtml);
            } else {
                mui.toast("Network error, please try again!");
            }
        })
        .fail(function() {
            mui.toast("Network error, please try again!");
        });
        
    }

    // 页面点击
    function clickList () {
        $('#bigbox').on('click', '#changeAddBtn', function(e) {
            // 删除mui返回键的作用
            $('#back').removeClass('mui-action-back');
            $('#back').removeClass('noaddr');
            // $('#addlist').show();
            hideAndShow ('#addlist');
            getAddrList();
        });

        $('#back').on("click",function() {
            var that = $(this);
            if($("#addlist").css("display")=='block') {
                // 还原mui返回键作用
                that.addClass('mui-action-back');
                hideAndShow('#bigbox');
            }
            
            if($("#addAddr").css("display")=='block' && that.hasClass('noaddr')) {
                that.addClass('mui-action-back');
                hideAndShow ('#bigbox');
            } else {
                if($("#addAddr").css("display")=='block') {
                    hideAndShow ('#addlist');
                }
            }

        });
     
        $('#bigbox').on('click', '.submit', function(e) {
            var addnumber = $('#setAddrId').attr("addrid");
            var token = window.localStorage.getItem('token');
            if (addnumber == undefined) {
                mui.toast("Please add your detailed address.");
            } else {
                $.ajax({
                    beforeSend: function(request) {
                        request.setRequestHeader("TOKEN", token);
                    },
                    url: csOrzs + '/Api/Order/mkOrder',
                    type: 'POST',
                    data: {
                            price_array: proObj,
                            address_id: addnumber,
                            email: null,
                            cart_array: deleteArr
                        },
                })
                .done(function(data) {
                    console.log(data);
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
                    mui.toast("Network error, please try again!");
                })
            }
            
        });
        

        $("#addlist").on('click', '.mui-table-view-cell', function(event) {
            event.preventDefault();
            hideAndShow ('#bigbox');
            $('#back').addClass('noaddr');
            $('#back').addClass('mui-action-back');
            var addrid = $(this).attr('addrid');
            setaddr(addrid);
        });

        $(document).on('click', '.order-add-address', function() {
            flag = 0;
            clearAddr ();
            hideAndShow ('#addAddr');
        });
        $(document).on('click', '#AddAddrBtn', function() {
            // 删除mui返回键的作用
            clearAddr ();
            flag = 1;
            $('#back').removeClass('mui-action-back');
            $('#back').addClass('noaddr');
            hideAndShow ('#addAddr');
        });
        function hideAndShow (show) {
            $('.order-page-content > div').each(function(index, el) {
                $(this).hide();
            });
            $(show).fadeIn("fast");
        }
        function clearAddr () {
            $('#name').val('');
            $('#number').val('');
            $('#cityResult3').val('');
            $('#textarea').val('');
            $('#checkDeafult').removeAttr("checked");
        }
    }


    // 设置地址
    function setaddr(addrid) {
        var token = window.localStorage.getItem("token");
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
                url: csOrzs + '/Api/Address/getOne',
                type: 'POST',
                data: {
                    address_id: addrid
                },
            })
            .done(function(data) {
                console.log(data);
                if (data.code == 1) {
                    window.localStorage.setItem('token',data.data.token);
                    var singleaddrHtml = template("singleaddrTemplate",data.data.address);
                    $("#singleaddr").html(singleaddrHtml);
                } else {
                    mui.toast("Network error, please try again!");
                }
            })
            .fail(function() {
                mui.toast("Network error, please try again!");
            })
    }
    // 设置地址
    function setaddr2(addrid) {
        var token = window.localStorage.getItem("token");
        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
                url: csOrzs + '/Api/Address/getOne',
                type: 'POST',
                data: {
                    address_id: addrid
                },
            })
            .done(function(data) {
                console.log(data);
                if (data.code == 1) {
                    window.localStorage.setItem('token',data.data.token);
                    var singleaddrHtml = template("singleaddrTemplate2",data.data.address);
                    $(".select-address.order-con").html(singleaddrHtml);
                } else {
                    mui.toast("Network error, please try again!");
                }
            })
            .fail(function() {
                mui.toast("Network error, please try again!");
            })
    }

    // 获取地址列表
    function getAddrList() {
        var token = window.localStorage.getItem('token');
        html = '';
        $.ajax({
            // 请求网址
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token);
            },
            url: csOrzs + '/Api/Address/getList',
            type: 'GET',
            // 请求参数，一般会带上页码
            data: {
                pageSize: 1000,
                p: 1,
            },
            success: function(data) {
                console.log(data);
                if (data.code == 1) {
                    window.localStorage.setItem('token',data.data.token);
                    var arrDate = data.data.list;
                    var arrlistdata2 = {"arrlistdata":arrDate};
                    var arrDateHtml = template('addrListTemplate',arrlistdata2);

                    $("#addlist").html(arrDateHtml);
                } else {
                    mui.toast("Network error, please try again!");
                }
            },
            error: function() {
                mui.toast("Network error, please try again!");
            }
        });

    }

    
    // 添加地址
    function addAddr() {
        var _getParam = function(obj, param) {
            return obj[param] || '';
        };                  
        var showUserPickerButton = document.getElementById('showUserPicker');
        var userResult = document.getElementById('userResult');             
        //三级联动
        // var cityPicker3 = new mui.PopPicker({
        //     layer: 3
        // });
        // cityPicker3.setData(cityData3);
        // var showCityPickerButton = document.getElementById('showCityPicker3');
        // var cityResult3 = document.getElementById('cityResult3');
        // showCityPickerButton.addEventListener('tap', function(event) {
        //     cityPicker3.show(function(items) {
        //         cityResult3.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text');
                //返回 false 可以阻止选择框的关闭
                //return false;
        //     });
        //     $('input').blur();
        // }, false);
        //输入框校验开始
        var subto = document.getElementById('subto');
        subto.addEventListener('tap',function() {
            var tel = /^1[34578]\d{9}$/;
            var name = document.getElementById('name').value;
            var theNumber = document.getElementById('number').value;
            // var cityResult3 = document.getElementById('cityResult3').value;
            var theTextareaC = document.getElementById('textareaC').value;
            var theTextareaE = document.getElementById('textareaE').value;
            var checkDeafultFlag = ($('#checkDeafult').is(':checked') == false)?0:1;
            console.log(checkDeafultFlag);

            // console.log(name,theNumber,cityResult3,theTextarea)
            if(name == '') {
                mui.toast('Please enter your name!');
                return false
            }else if(!tel.test(theNumber)) {
                    mui.toast('Please enter a 11-digit vaild number!');
                return false
            }
            // else if(cityResult3 == '') {
            //     mui.toast('Please select your region!');
            //     return false
            // }
            else if(theTextareaC == '') {       
                mui.toast('Please write down your detailed address in Chinese!');
                return false
            }
            
            var token = window.localStorage.getItem('token');
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("TOKEN", token);
                },
                url: csOrzs + '/Api/Address/addAddress',
                type: 'POST',
                data: {
                    fullname: name,
                    phone: theNumber,
                    // region: cityResult3,
                    region: theTextareaC,
                    region_detail: theTextareaE,
                    is_default: checkDeafultFlag
                }
            })
            .done(function(data) {
                console.log(data);
                if (data.code == 1) {
                    window.localStorage.setItem('token',data.data.token);
                    if (flag == 0) {
                        setaddr(data.data.address_id);
                    } else {
                        setaddr2(data.data.address_id);
                    }
                    $('.order-page-content > div').each(function(index, el) {
                        $(this).hide();
                        
                    });
                    $('#bigbox').show();
                    $('#back').addClass('mui-action-back');
                }
                
            })
            .fail(function() {
                mui.toast("Error!");
            });
            


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


})(mui);