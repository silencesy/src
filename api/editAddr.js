(function(mui) {
    editLodding ();  
    submit();          
    function editLodding () {

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
        // $("#inputAdd").on('click', '#showCityPicker3', function(event) {
        //     cityPicker3.show(function(items) {
        //        console.log(_getParam(items[0], 'text'));
        //        $('#cityResult3').val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text'));
        //     });
        //     $('input').blur();
        // });

        var token = window.localStorage.getItem("token");
        var addrid = getUrlParam('addrid');
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
                    var editHtml = template("editTemplate",data.data.address);
                    $("#inputAdd").html(editHtml);
                } else {
                    mui.toast("Network error, please try again!");
                }
            })
            .fail(function() {
                mui.toast("Network error, please try again!");
            })
    }

    function submit() {
        //输入框校验开始
        var addrid = getUrlParam('addrid');
        var subto = document.getElementById('subto');
        subto.addEventListener('tap',function() {
            var tel = /^1[34578]\d{9}$/;
            var name = document.getElementById('name').value;
            var theNumber = document.getElementById('number').value;
            var theTextareaC = document.getElementById('textareaC').value;
            var theTextareaE = document.getElementById('textareaE').value;
            // var cityResult3 = document.getElementById('cityResult3').value;
            var theTextarea = document.getElementById('textarea').value;

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
                url: csOrzs + '/Api/Address/editAddress',
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
                if (data.code == 1) {
                    window.localStorage.setItem('token',data.data.token);
                    window.location.href = './address.html';
                }
                
            })
            .fail(function() {
                mui.toast("Error!");
            });
            


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