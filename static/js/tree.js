/**
 * @Description: 树形节点的配置文件
 * @Author: xujia(2014-02-27 21:41)
 */
var PafWebLib = PafWebLib || {};
PafWebLib.TREEDATA = [
    { "id": "home", "url": "docs/home.html", "text": "Home", "leaf": true },
    { "id": "css", "text": "CSS", expanded: false, children: [
        { id:"css.reset", text: "reset", "url" : "docs/css/css.reset.html", leaf: true },
        { id:"css.grid", text: "grid", "url" : "docs/css/css.grid.html", leaf: true}
    ]},
    { "id": "js", "text": "JS", expanded: false, children: [
        { id:"js.global", text: "global", "url" : "docs/js/js.global.html", leaf: true }
    ]},
    { "id": "widget", "text": "Widget", expanded: false, children: [
    ]},
    { "id": "snippets", "text": "Snippets", expanded: false, children: [
    ]},
    { "id": "snippets", "text": "Snippets", expanded: false, children: [
    ]},
    { "id": "tools", "text": "Tools", expanded: false, children: [
    ]},
    { "id": "rules", "text": "Rules", expanded: false, children: [
    ]}
];
PafWebLib.TREEDATA.getUrl = function(id){
    var res = null;
    (function(data){
        for(var i = 0, len = data.length; i < len; i++){
            var tmp = data[i];
            if(tmp.id == id){
                res = tmp;
                return;
            }else if(tmp.children){
                arguments.callee(tmp.children);
            }
        }
    })(PafWebLib.TREEDATA);
    return res;
}
