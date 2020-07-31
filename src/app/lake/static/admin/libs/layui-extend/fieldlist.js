!(function(a){
    layui.define(['jquery', "laytpl", "jquery_dragsort"], function (exports) {
        var laytpl = layui.laytpl,
            jquery = layui.$;
            
        a(jquery, laytpl);
        
        exports('fieldlist', {});
    });
})(function($, laytpl) {
    
    var cssStyle = '\
<style type="text/css" class="lake-admin-fieldlist-css">\
.fieldlist {\
  margin-top: 5px;\
}\
.fieldlist .fieldlist-head span {\
  width: 110px;\
  display: inline-block;\
  font-weight: bold;\
  font-size: 13px;\
}\
.fieldlist dd {\
  display: block;\
  margin: 5px 0;\
}\
.fieldlist dd input {\
  display: inline-block;\
  width: 300px;\
}\
.fieldlist dd input:first-child {\
  width: 105px;\
}\
.fieldlist dd ins {\
  width: 110px;\
  display: inline-block;\
  text-decoration: none;\
}\
.fieldlist .layui-btn+.layui-btn {\
    margin-left: 0 !important;\
}\
.fieldlist .btn-append {\
    padding: 0 6px;\
    font-size: 13px;\
}\
.fieldlist .fieldlist-btns {\
    padding: 6px 0;\
}\
</style>';
    if ($(".lake-admin-fieldlist-css").length <= 0) {
        $("head").append(cssStyle);
    }
    
    $.fn.fieldlist = function() {
        
        this.each(function() {
            var thiz = this;
            
            var el = $(this).data("el");
            var main = $(this).data("main");
            var template = $(this).data("template");
            
            var mainTpl = '<dl class="fieldlist">\
                <dd class="fieldlist-head">\
                    <span>字段</span>\
                    <span>内容</span>\
                </dd>\
                <dd class="fieldlist-btns">\
                    <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-success btn-append">\
                        <i class="iconfont icon-add"></i> 添加\
                    </a>\
                </dd>\
            </dl>';
            
            var fieldlistTpl = '<dd class="fieldlist-item">\
                <ins><input type="text" class="layui-input" data-name="{{d.name}}[{{d.index}}][key]" value="{{d.row.key?d.row.key:""}}" placeholder="填写字段"/></ins>\
                <ins><input type="text" class="layui-input" data-name="{{d.name}}[{{d.index}}][value]" value="{{d.row.value?d.row.value:""}}" placeholder="填写内容"/></ins>\
                <span class="layui-btn layui-btn-sm layui-btn-danger btn-remove"><i class="iconfont icon-close1"></i></span>\
                <span class="layui-btn layui-btn-sm layui-btn-primary btn-dragsort"><i class="iconfont icon-yidong"></i></span>\
            </dd>';
            
            if (main) {
                mainTpl = $(main).html();
            }
            
            var fieldlistClass = 'lake-admin-fieldlist-' + (new Date()).valueOf();
            mainTpl = $(mainTpl).addClass(fieldlistClass).prop("outerHTML");
            
            if (el) {
                $(el).html(mainTpl);
            } else {
                $(mainTpl).insertBefore($(thiz));
            }
            
            var container = $('.' + fieldlistClass);

            // 刷新隐藏textarea的值
            var refresh = function () {
                var data = {};
                var textarea = $(thiz);
                $("input,select,textarea", container).each(function () {
                    var name = $(this).attr('data-name');
                    var value = $(this).prop('value');
                    
                    var reg = /\[(\w+)\]\[(\w+)\]$/g;
                    var match = reg.exec(name);
                    if (!match) {
                        return true;
                    }
                    match[1] = "x" + parseInt(match[1]);
                    if (typeof data[match[1]] == 'undefined') {
                        data[match[1]] = {};
                    }
                    data[match[1]][match[2]] = value;
                });
                var result = {};
                $.each(data, function (i, j) {
                    if (j) {
                        if (j.key != '') {
                            result[j.key] = j.value;
                        }
                    }
                });
                textarea.val(JSON.stringify(result));
            };
            
            // 监听文本框改变事件
            container.on('change keyup', "input,textarea,select", function () {
                refresh();
            });
            
            // 追加控制
            container.on("click", ".btn-append,.js-append", function (e, row) {
                var index = $(thiz).data("index");
                var name = $(thiz).attr("name");
                var template = $(thiz).data("template");
                var data = $(thiz).data();
                
                index = index ? parseInt(index) : 0;
                $(thiz).data("index", index + 1);
                var row = row ? row : {};
                var vars = {index: index, name: name, data: data, row: row};
                
                var tpl = '';
                if (template) {
                    tpl = $(template).html();
                } else {
                    tpl = fieldlistTpl;
                }

                var html = laytpl(tpl || '').render(vars);
                $(html).insertBefore($(this).parent());
            });
            
            // 移除控制
            container.on("click", ".btn-remove,.js-remove", function () {
                $(this).closest("dd").remove();
                refresh();
            });
            
            // 拖拽排序
            container.dragsort({
                itemSelector: 'dd.fieldlist-item',
                dragSelector: ".btn-dragsort,js-dragsort",
                dragEnd: function () {
                    refresh();
                },
                placeHolderTemplate: "<dd class='fieldlist-item'></dd>",
                scrollSpeed: 15
            });
            
            // 渲染数据
            var render = function () {
                var textarea = $(thiz);
                if (textarea.val() == '') {
                    return true;
                }
                var json = {};
                try {
                    json = JSON.parse(textarea.val());
                } catch (e) {
                }
                $.each(json, function (i, j) {
                    $(".btn-append,.js-append", container).trigger('click', {
                        key: i,
                        value: j
                    });
                });
            };
            render();
        });
        
        return this;
    }
});
