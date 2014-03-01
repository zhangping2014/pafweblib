/**
 * @Description: 树形节点的配置文件
 * @Author: xujia(2014-02-27 21:41)
 */
var PafWebLib = PafWebLib || {};
PafWebLib.TREEDATA = [
    { "id": "home", "href": "docs/home.html", "text": "Home", "leaf": true },
    { "id": "css", "text": "CSS", expanded: true, children: [
        { text: "reset", "href" : "docs/css/reset.html", leaf: true },
        { text: "grid", "href" : "docs/css/grid.html", leaf: true}
    ]}
]
