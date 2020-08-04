/*!
 * lakeMenuLeftZoom.js v1.0.2
 * https://github.com/deatil/lake-admin
 * 
 * Apache License 2.0 © Deatil
 */
!(function(a){
    layui.define(['jquery', 'jqueryCookie'], function (exports) {
        var element = layui.element,
            jquery = layui.$;
        
        exports('lakeMenuLeftZoom', a(jquery, element));
    });
})(function($, element) {
    
    // 左侧放大
    var lakeMenuLeftZoom = {
        
        list: function () {
            var thiz = this;
            var openTip = '';
            
            // 监听提示信息
            $("body").on("mouseenter", ".layui-layout-admin-collapse .layui-nav-tree .lake-admin-nav-item", function () {
                var tips = $(this).prop("innerHTML");
                if (tips) {
                    tips = "<ul class='lake-admin-menu-left-zoom layui-nav layui-nav-tree layui-this js-menu-nav'><li class='layui-nav-item layui-nav-itemed'>"+tips+"</li></ul>" ;
                    openTip = layer.tips(tips, $(this), {
                        tips: [2, '#2f4056'],
                        time: 300000,
                        skin: "popup-tips",
                        success:function (el) {
                            var left = $(el).position().left - 10 ;
                            $(el).css({ left:left });
                            element.render();
                        }
                    });
                }
            });

            $("body").on("mouseleave", ".popup-tips", function () {
                try {
                    layer.close(openTip);
                } catch (e) {
                    console.log(e.message);
                }
            });
        },
        
        tip: function () {
            // 左侧导航标题
            var left_nav_layer_tips;
            $(document).on('mouseenter', ".layui-layout-admin-collapse .lay-tip-title", function() {
                var title = $(this).attr("lay-title");
                left_nav_layer_tips = layer.tips(title, this, {
                    tips: [2, '#009688'],
                });
            });
            $(document).on('mouseleave', ".layui-layout-admin-collapse .lay-tip-title", function() {
                layer.close(left_nav_layer_tips);
            });
        },
        
        listenCollapse: function () {
            // 设置默认状态
            if ($.cookie('admin-collapse') == 'collapse') {
                $(".layui-layout-admin").addClass("layui-layout-admin-collapse");
            }
            
            // 隐藏左侧导航
            $(document).on('click', ".admin-menu-toggle", function() {
                if ($(".layui-layout-admin").hasClass("layui-layout-admin-collapse")) {
                    $(".layui-layout-admin").removeClass("layui-layout-admin-collapse");
                    $.cookie('admin-collapse', null);
                } else {
                    $(".layui-layout-admin").addClass("layui-layout-admin-collapse");
                    $.cookie('admin-collapse', 'collapse', {
                        expires: 1,
                    });
                }
            });
        },
        
        listen: function(zoomType) {
            this.listenCollapse();
            
            var type = zoomType || 'tip';
            if (type == 'list') {
                this.list();
            } else {
                this.tip();
            }
            
        }
    };
    
    return lakeMenuLeftZoom;
});
