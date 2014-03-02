/**
 * @Description: PafWebLib系统初始化
 * @Author: xujia(2014-02-27 21:41)
 */
!function(){
    // 左侧树型面板
    var pageTreePanel =  null;
    // 页面标签面板
    var pageTabPanel = null;

    /**
     * Add basic filtering to Ext.tree.Panel. Add as a mixin:
     *  mixins: {
 *      treeFilter: 'WMS.view.TreeFilter'
 *  }
     */
    Ext.define('PageTreeFilter', {
        filterByText: function(text) {
            this.filterBy(text, 'text');
        },
        /**
         * Filter the tree on a string, hiding all nodes expect those which match and their parents.
         * @param The term to filter on.
         * @param The field to filter on (i.e. 'text').
         */
        filterBy: function(text, by) {
            this.clearFilter();
            var view = this.getView(),
                me = this,
                nodesAndParents = [];
            // Find the nodes which match the search term, expand them.
            // Then add them and their parents to nodesAndParents.
            this.getRootNode().cascadeBy(function(tree, view){
                var currNode = this;

                if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                    me.expandPath(currNode.getPath());
                    while(currNode.parentNode) {
                        nodesAndParents.push(currNode.id);
                        currNode = currNode.parentNode;
                    }
                }
            }, null, [me, view]);
            // Hide all of the nodes which aren't in nodesAndParents
            this.getRootNode().cascadeBy(function(tree, view){
                var uiNode = view.getNodeByRecord(this);
                if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                    Ext.get(uiNode).setDisplayed('none');
                }
            }, null, [me, view]);
        },
        clearFilter: function() {
            var view = this.getView();
            this.getRootNode().cascadeBy(function(tree, view){
                var uiNode = view.getNodeByRecord(this);
                if(uiNode) {
                    Ext.get(uiNode).setDisplayed('table-row');
                }
            }, null, [this, view]);
        }
    });


    /*
     * 定义平安付web系统类
     * */
    Ext.define('PafWebLibSys', {
        config: {
            pageTreePanel: null,
            pageTabPanel: null
        },
        constructor: function(config){
            this.initConfig(config);
            this.createViewport();
            this.bindEvents();
        },
        createViewport: function(){
            Ext.create('Ext.container.Viewport', {
                layout: 'border',
                items: [
                    {
                        region: 'north',
                        contentEl: 'header',
                        autoHeight: true,
                        border: false,
                        margins: '0 0 0 0'
                    },
                    {
                        layout: 'border',
                        region: 'west',
                        split: true,
                        header: false,
                        width: 200,
                        minSize: 200,
                        maxSize: 200,
                        collapsible: true,
                        margins: '4 0 4 4',
                        animCollapse: false,
                        animate: false,
                        collapseMode: 'mini',
                        collapseFirst: false,
                        items: this.pageTreePanel
                    }, this.pageTabPanel
                ]
            });
        },
        bindEvents: function(){
            var me = this;
            me.pageTreePanel.on('itemclick', function(view, record, item, index, e){
                me.loadPage.apply(me, arguments);
                e.stopEvent();
            });
        },
        loadPage: function(view, record, item, index){
            var me = this, data = record.raw ,
                cbxTabs = Ext.getCmp('cbxTabs'), isTabs = cbxTabs.getValue(),
                id = "paf-" + data.id, pageTabPanel = me.pageTabPanel,
                tabPanel = pageTabPanel.getComponent(id), url = window.location.href.split('#')[0];
            window.location.href = url + '#' + data.id;

            // 判断是否已存在该tab
            if(tabPanel){
                pageTabPanel.setActiveTab(tabPanel);
            }else{
                // 启用标签浏览
                if(data.leaf && !isTabs){
                    pageTabPanel.removeAll();
                }
                if(data.leaf){
                    var tmpPanel = Ext.create('Ext.panel.Panel',{
                        id: id,
                        title: data.text,
                        closable:true,
                        html: Ext.String.format('<iframe frameborder="0" src="{0}?t={1}"></iframe>', data.url, new Date().valueOf())
                    });
                    pageTabPanel.add(tmpPanel);
                    pageTabPanel.setActiveTab(tmpPanel)
                }
            }
        }
    });

    /*
     * 定义左侧树型面板PagesTreePanel类
     * */
    Ext.define('pageTreePanel', {
        extend: 'Ext.tree.Panel',
        //这里不要忘记
        mixins: {
            treeFilter: 'PageTreeFilter'
        },
        constructor: function (config) {
            config = config || {};
            // calls Ext.tree.Panel's constructor
            this.callParent([{
                id: 'apiTreepanel',
                region: 'center',
                layout: '',
                title: "资源导航",
                store: Ext.create('Ext.data.TreeStore', {
                    root: {
                        expanded: true,
                        children: PafWebLib.TREEDATA
                    }
                }),
                bodyStyle:'background:#f3f3f3',

                tbar: [
                    Ext.create("TriggerField"),
                        '->', {
                        iconCls: 'icon-expand-all',
                        tooltip: 'Expand All',
                        handler: function(){
                            this.expandAll();
                        },
                        scope: this
                    }, '-', {
                        iconCls: 'icon-collapse-all',
                        tooltip: 'Collapse All',
                        handler: function(){
                            this.collapseAll();
                        },
                        scope: this
                    }
                ],
                bbar: [' ', new Ext.form.Checkbox({
                        id: 'cbxTabs',
                        checked: true,
                        bodyStyle: {
                            background: '#ffc',
                            padding: '10px'
                        },
                        boxLabel: '启用标签浏览'
                    })
                ],
                rootVisible: false,
                border: false,
                autoScroll: true,
                renderTo: Ext.getBody(),
                collapseFirst: false
            }]);
        }
    });

    /*
     * 定义页面标签面板PageTabPanel类
     * */
    Ext.define('PageTabPanel', {
        extend: 'Ext.tab.Panel',
        constructor: function (config) {
            config = config || {};
            // calls Ext.tree.Panel's constructor
            this.callParent([{
                id: 'pagePanel',
                region: 'center',
                bodyStyle:'background:#f3f3f3',
                margins: '4 4 4 0',
                resizeTabs: true,
                minTabWidth: 135,
                tabWidth: 135,
                bodyBorder: false
            }]);
        }
    });



    /*
     * 过滤输入框类
     */
    Ext.define('TriggerField', {
        extend: 'Ext.form.field.Trigger',
        triggerCls: 'x-form-clear-trigger',
        onTriggerClick: function () {
            this.setValue('');
            Ext.getCmp("apiTreepanel").clearFilter();
        },
        width:'100',
        emptyText:'快速检索功能',
        enableKeyEvents: true,
        listeners: {
            keyup: {
                fn: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        Ext.getCmp("apiTreepanel").filterByText(this.getRawValue());
                    }
                }
            }
        }
    });

    Ext.onReady(function () {
        // 初始化左侧树型面板
        pageTreePanel =  Ext.create('pageTreePanel');
        // 初始化页面标签面板
        pageTabPanel = Ext.create('PageTabPanel');
        // 初始化平安付web系统
        var pafWebLibSys = Ext.create('PafWebLibSys', {
            pageTreePanel: pageTreePanel,
            pageTabPanel: pageTabPanel
        });
    });
}();






