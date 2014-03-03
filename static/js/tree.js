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
