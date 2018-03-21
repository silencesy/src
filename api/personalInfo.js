(function(mui, doc) {
    mui.init();
    getUserInfo ();
    mui.ready(function() {
        var userPicker = new mui.PopPicker();
        userPicker.setData([{
            value: 'female',
            text: 'Female'
        }, {
            value: 'male',
            text: 'Male'
        }]);
        var showUserPickerBtn = doc.getElementById('clickUserPicker');
        var showUserPickerButton = doc.getElementById('showUserPicker');
        var userResult = doc.getElementById('userResult');
        showUserPickerBtn.addEventListener('tap', function(event) {
            userPicker.show(function(items) {
                var token2 = localStorage.getItem("token");
                var sexVal = '';
                // console.log(items[0].text);
                if (items[0].text == "Female") {
                    sexVal = 1;
                } else if ( items[0].text == "Male" ) {
                    sexVal = 2;
                }
                $.ajax({
                    beforeSend: function(request) {
                        request.setRequestHeader("TOKEN", token2);
                    },
                    url: csOrzs + '/Api/Common/editUserInfo',
                    type: 'POST',
                    data: {sex: sexVal},
                })
                .done(function(data) {
                    if (data.code == 1) {
                        localStorage.setItem("token",data.data.token);
                        showUserPickerButton.innerText = items[0].text;
                        mui.toast("Successfully!");
                    } else {
                        mui.toast("Network error, please try again!");
                    }
                })
                .fail(function() {
                    mui.toast("Network error, please try again!");
                })
            });
        }, false);
    });
    
    document.getElementById("emailBtn").addEventListener('tap', function(e) {
        e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
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
                    var token2 = localStorage.getItem("token"); //获取用户token
                    $.ajax({
                        beforeSend: function(request) {
                            request.setRequestHeader("TOKEN", token2);
                        }, //ajax传token  固定写法
                        url: csOrzs + '/Api/Common/editUserInfo',  //接口地址
                        type: 'POST', //请求方式
                        data: {email: e.value},  //请求参数
                        //{ mobile: value, email: value,key: value,key: value }
                    })
                    .done(function(data) {
                        console.log(data);  //后台返回数据
                        if (data.code == 1) {
                            localStorage.setItem("token",data.data.token); //设置用户token
                            emailText.innerText = e.value;
                            mui.toast("Successfully!");
                        } else {
                            mui.toast("Network error, please try again!");
                        }
                    })
                    .fail(function() {
                        mui.toast("Network error, please try again!");
                    })
                }

               
                
            } else {
                
            }
        })
    });

    var userName = document.getElementById("userName");
    document.getElementById("editName").addEventListener('tap', function(e) {
        e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
        var btnArray = ['Cancel', 'Done'];
        mui.prompt('Change your username', 'username', ' ', btnArray, function(e) {
            if (e.index == 1) {
                if (e.value.length==0) {
                    mui.toast("Please enter your email address!");
                    return false;
                } else {
                    var token2 = localStorage.getItem("token");
                    $.ajax({
                        beforeSend: function(request) {
                            request.setRequestHeader("TOKEN", token2);
                        },
                        url: csOrzs + '/Api/Common/editUserInfo',
                        type: 'POST',
                        data: {third_name: e.value},
                    })
                    .done(function(data) {
                        if (data.code == 1) {
                            localStorage.setItem("token",data.data.token);
                            userName.innerText = e.value;
                            mui.toast("Successfully!");
                        } else {
                            mui.toast("Network error, please try again!");
                        }
                    })
                    .fail(function() {
                        mui.toast("Network error, please try again!");
                    })
                    
                }

               
                
            } else {
                
            }
        })
    });
    
    document.getElementById("camera").addEventListener('change',function(){
        var token = localStorage.getItem("token");
        var fileData = this.children[0].files[0];
        var reader = new FileReader(),imgFile; 
        reader.onload=function(e) {    
            imgFile = e.target.result; 
            console.log(imgFile) ;
            document.getElementById('showImg').src = imgFile;
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("TOKEN", token);
                },
                url: csOrzs + '/Api/Common/editUserInfo',
                type: 'POST',
                data: {head_img: imgFile},
            })
            .done(function(data) {
                console.log(data);
            })
            .fail(function() {
                console.log("error");
            });
            
        };  
        reader.readAsDataURL(fileData);
    });


    var loyout = doc.getElementById('loyout');
    loyout.addEventListener('tap',function(){
        var btnArray = ['Confirm', 'Cancel'];
        mui.confirm('Are you sure to log out?', ' ', btnArray, function(e) {
            if (e.index == 0) {
                localStorage.clear("token");
                window.location.href = './login.html';
            }
        });
    });

    // 修改密码
    document.getElementById("resetPassword").addEventListener('tap',function(){
        $('.info-popup').show();
        $('.info-popup-backdrop').show();
        console.log($('.info-popup'));
    });

    mui('body').on('tap','#info-cancel',function(e){
        $('.info-popup').hide();
        $('.info-popup-backdrop').hide();
    });
    mui('body').on('tap','#info-done',function(e){
        var pas1 = document.getElementById("pas1").value;
        var pas2 = document.getElementById("pas2").value;
        var reg = /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/g;
        var token = localStorage.getItem("token");
        if(pas1 == '') {
            mui.toast("Please enter your original password!");
        } else if ( pas2 == '') {
            mui.toast("Please enter your new password!");
        } else if (!reg.test($("#pas2").val())){
            mui.toast("Please enter new password with 6-16 digits (numbers and letters)!");
            // $("#pas2").focus();
        } else {
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("TOKEN",token);
                },
                url: csOrzs + '/Api/Common/editUserInfo',
                type: 'POST',
                data: {'old_password': pas1,'password': pas2},
            })
            .done(function(data) {
                if (data.code == 0) {
                    mui.toast("The original password is incorrect!");
                    return false;
                } else if (data.code == 1) {
                    mui.toast('Successfully!'); 
                    $('.info-popup').hide();
                    $('.info-popup-backdrop').hide();
                } else {
                    mui.toast("Network error, please try again!");
                }
            })
            .fail(function() {
                mui.toast("Network error, please try again!");
            })
          
        }   
    });
        
               

    // 获取用户信息
    function getUserInfo () {
        var token2 = localStorage.getItem("token");
        $.ajax({
            // 请求网址
            beforeSend: function(request) {
                request.setRequestHeader("TOKEN", token2);
            },
            url: csOrzs + '/Api/Common/getUserInfo',
            type: 'POST',
        })
        .done(function(data) {
            console.log(data);
            var userData = data.data.user_data;
            if (data.code == 1) {
                $('#showImg').attr({
                    src: userData.head_img
                });
                $('#userName').html(userData.third_name);
                if (userData.sex == 1) {
                    $('#showUserPicker').html("Female");
                } else {
                    $('#showUserPicker').html("Male");
                }
                $('#emailText').html(userData.email);
                
            } else {
                mui.toast("Network error, please try again!");
            }
        })
        .fail(function() {
            mui.toast("Network error, please try again!");
        });

    }
})(mui, document);