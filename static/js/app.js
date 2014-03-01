/**
 * @Description: PafWebLib系统初始化
 * @Author: xujia(2014-02-27 21:41)
 */
!function(){
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
                var data = record.raw;
                if(data.href){
                    me.pageTabPanel.add(Ext.create('Ext.tab.Panel',{
                        title: "test",
                        closable:true,
                        html: Ext.String.format('<iframe frameborder="0" src="{0}?t={1}"></iframe>', data.href, new Date().valueOf())
                    }));
                }
                // todo 判断是否已存在改tab
                e.stopEvent();
            });
        }
    });

    /*
     * 定义左侧树型面板PagesTreePanel类
     * */
    Ext.define('pageTreePanel', {
        extend: 'Ext.tree.Panel',
        constructor: function (config) {
            config = config || {};
            // calls Ext.tree.Panel's constructor
            this.callParent([{
                id: 'apiTreepanel',
                region: 'center',
                header: false,
                store: Ext.create('Ext.data.TreeStore', {
                    root: {
                        expanded: true,
                        children: PafWebLib.TREEDATA
                    }
                }),
//                tbar: [' ', new Ext.app.FilterField({
//                    id: 'txtFilter',
//                    emptyText: 'Keywords...',
//                    enableKeyEvents: true,
//                    listeners: {
//                        render: function(f){
//                            this.filter = new Ext.tree.TreeFilter(this, {
//                                clearBlank: true,
//                                autoClear: true
//                            });
//                        },
//                        keydown: {
//                            fn: this.filterTree,
//                            buffer: 350,
//                            scope: this
//                        },
//                        scope: this
//                    }
//                }), '->', {
//                    iconCls: 'icon-expand-all',
//                    tooltip: 'Expand All',
//                    handler: function(){
//                        this.root.expand(true);
//                    },
//                    scope: this
//                }, '-', {
//                    iconCls: 'icon-collapse-all',
//                    tooltip: 'Collapse All',
//                    handler: function(){
//                        this.root.collapse(true);
//                    },
//                    scope: this
//                }],
//                bbar: [' ', new Ext.form.Checkbox({
//                    id: 'cbxTabs',
//                    checked: true,
//                    boxLabel: '启用标签浏览'
//                })],
                rootVisible: false,
                border: false,
                autoScroll: true,
                renderTo: Ext.getBody(),
                collapseFirst: false
            }]);
        },
        /*
         * 初始化组件
         */
        initComponent: function(){
            this.hiddenPkgs = [];
            this.callParent();
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
                margins: '4 4 4 0',
                resizeTabs: true,
                minTabWidth: 135,
                tabWidth: 135,
                border: false,
                bodyBorder: false
            }]);
        },
        /*
         * 初始化组件
         */
        initComponent: function(){
            this.callParent();
        }
    });

    /*
     * 扩展过滤框
     */
    /*PafWebLib.FilterField = Ext.extend(Ext.form.TriggerField, {
        initComponent: function(){
            Ext.app.FilterField.superclass.initComponent.call(this);
        },
        triggerClass: 'x-form-clear-trigger',
        hideTrigger: true,
        validationEvent: false,
        validateOnBlur: false,

        onTriggerClick: function(){
            this.el.dom.value = '';
            this.trigger.hide();
            this.focus();
            this.fireEvent('keydown', this);
        }
    });*/


    Ext.onReady(function () {
        // 初始化左侧树型面板
        var pageTreePanel =  Ext.create('pageTreePanel');
        // 初始化页面标签面板
        var pageTabPanel = Ext.create('PageTabPanel');
        // 初始化平安付web系统
        var pafWebLibSys = Ext.create('PafWebLibSys', {
            pageTreePanel: pageTreePanel,
            pageTabPanel: pageTabPanel
        });

    });
}();






