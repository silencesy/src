(function(mui) {
    var searchInfo = getUrlParam("searchdata");
    console.log(searchInfo);
    if (searchInfo == '') {
        $('title').text("All Shops");
    } else {
        $('title').text(searchInfo);
    }
    
    $('.iconfont.icon-sousuo').on('click',function(){
        var shopSearchInfo = $('#selfShopSearch').val();
        if (shopSearchInfo == '') {
            $('#selfShopSearch').blur();
            mui.toast("Please enter keywords!");
        } else {
            window.location.href = './search-result.html?searchdata='+ shopSearchInfo;
        }
    });
    $('#searchShopForm').submit(function(event) {
        var shopSearchInfo = $('#selfShopSearch').val();
        if (shopSearchInfo == '') {
            $('#selfShopSearch').blur();
            mui.toast("Please enter keywords!");

        } else {
            window.location.href = './search-result.html?searchdata='+ shopSearchInfo;
        }
    });
    mui('body').on('tap','a',function(){document.location.href=this.href;});
    loading();
    function loading() {
        $('#selfShopSearch').val(searchInfo);
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                // down: {
                //  contentdown : "Pull down to refresh",
                //  contentover : "Release to refresh",
                //  contentrefresh : "Loading…",
                //  callback: pulldownRefresh
                // },
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
            $.ajax({
                url: csOrzs + '/Api/Archive/search',
                type: 'GET',
                data: {
                        search_name: searchInfo,
                        pageSize: 8,
                        p: page,
                        search_cat: 'Merchant'
                    },
            })
            .done(function(response) {
                var shopListData = response;
                if (shopListData.code == 0) {
                    $('#listdata').html('');
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    mui.toast("Sorry, we couldn't find a match for your search!");
                } else if (shopListData.code == 1) {
                    var totalPages = shopListData.data.totalPages;
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh((page == totalPages || totalPages == 0));
                    var shopArr = shopListData.data.merchant;
                    var shopsList2 = {"shopsList":shopArr};
                    var shopsListHtml = template('shops', shopsList2);
                    $('#listdata').append(shopsListHtml);
                    imgLazyLoad();
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
    }

    function imgLazyLoad() {
        $("img.lazy").lazyload({ 
            effect : "fadeIn",
            placeholder: "http://api.mall.thatsmags.com/Public/ckfinder/images/grey.jpg"
        }); 
    }

    // 获取地址栏参数
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