(function(mui) {
    mui.init();
    atricle(0,1,8);
    atricle(1,2,8);
    atricle(2,3,8);
    atricle(3,4,8);

    function atricle(index,flag,pageSize) {
        // 初始化页码
        var page = 0;
        // miniRefresh 对象
        var miniRefresh = new MiniRefresh({
            container: '#minirefresh'+index,
            down: {
                // isLock: true,
                contentdown: 'Release to refresh',
                contentover: 'Pull down to refresh',
                contentrefresh: 'Loading…',
                callback: function() {
                    miniRefresh.endDownLoading(true);
                }
            },
            up: {
                isAuto: true,
                contentdown: 'Pull up to load more',
                contentrefresh: 'Loading…',
                contentnomore: 'No more data',
                callback: function() {
                    // 递增页码
                    page++;
                    // console.log(0);
                    $.ajax({
                        // 请求网址
                        url: csOrzs + '/Api/Article/getList',
                        type: 'GET',
                        // 请求参数，一般会带上页码
                        data: {
                            'cat_id': flag,
                            'pageSize': pageSize,
                            'p': page
                        },
                        success: function(response) {
                            // 下面这段请根据自己的数据结构来处理
                            var articleDate = response;
                            console.log(articleDate);
                            if (articleDate.code == 1) {
                                var articleListData = articleDate.data.articles;
                                var totalPages = articleDate.data.totalPages;
                                var articelsList2 = {"articelsList":articleListData};
                                var articleListHtml = template('articels', articelsList2);
                                $('#listdata'+ index).append(articleListHtml);

                                var aticlelistData = articleDate.data.cat;
                                var articelsTitleList2 = {"articelsTitleList":aticlelistData};
                                var articelsTitletHtml = template('articelsTitle', articelsTitleList2);
                                $('#articelsTitleBox').html(articelsTitletHtml);
                                slidertrue ();
                                if (response.last_page == page || totalPages == 0) {
                                    miniRefresh.endUpLoading(true);
                                } else {
                                    miniRefresh.endUpLoading(false);
                                }
                            } else {
                                miniRefresh.endUpLoading(true);
                            }
                        },
                        error: function() {
                            miniRefresh.endUpLoading(true);
                        }
                    });
                }
            }
        });
    }
    
    function slidertrue () {
        var slider = mui("#slider");
        slider.slider({
            interval: 0
        });
        console.log(123);

    }
})(mui);
