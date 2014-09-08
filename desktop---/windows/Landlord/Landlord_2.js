/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Landlord', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.grid.RowNumberer',
        'Ext.util.*',
        'Ext.util.Format',
        'Ext.ux.form.field.ClearButton',
        'Ext.ux.form.field.OperatorButton',
        'Ext.ux.grid.column.ActionPro',
        'Ext.ux.grid.FilterBar',
        'Ext.ux.grid.AutoResizer',
        'Ext.grid.plugin.BufferedRenderer',
        'GeoExt.tree.OverlayLayerContainer',
        'GeoExt.tree.BaseLayerContainer',
        'GeoExt.grid.column.Symbolizer',
        'GeoExt.selection.FeatureModel',
        'GeoExt.data.LayerTreeModel',
        'GeoExt.data.FeatureStore',
        'GeoExt.tree.Column',
        'GeoExt.tree.Panel',
        'GeoExt.tree.View',
        'GeoExt.panel.Map',
        'GeoExt.Action',
    
        'Ext.tree.plugin.TreeViewDragDrop',
        'Ext.layout.container.Border',
        'Ext.selection.CellModel',
        'Ext.container.Viewport',
        'Ext.window.MessageBox',
        'Ext.state.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.form.*'

    ],
    id:'landlord-win',

    init : function(){
        this.launcher = {
            text: 'همه داده ها',
            iconCls:'icon-grid'
        };
    },
    
    AllData : function(){
        var me = {'userId': 1};
        // ------------ Land Lord Panel ------------
        var landLordModel = Ext.define('LandLordModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id', type: 'int'},
                {name: 'FirstName', type: 'string'},
                {name: 'LastName',  type: 'string'},
                {name: 'DadName',       type: 'string'},
                {name: 'Address',  type: 'string'},
                {name: 'Description',  type: 'string'},
                {name: 'Sharers',  type: 'string'}
            ]
        });
        var landLordStore = Ext.create('Ext.data.Store', {
            model: 'LandLordModel',
            pageSize: 10,
            proxy: {
                type: 'ajax',
                url: 'index.php?r=landlord/AllLandlord',
                //url: 'index.php?r=business/shoppingLand',
                reader: {
                    type: 'json',
                    root: 'LandLordsDetail',
                    totalProperty: 'totalCount'
                }
            },
            filterParam: 'query',
            
            encodeFilters: function(filters) {
                return filters[0].value;
            },
            remoteFilter: true,
            autoLoad: true
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            listeners: {
                cancelEdit: function(rowEditing, context) {
                    if (context.record.phantom) {
                        landLordStore.remove(context.record);
                    }
                },
                edit: function(e, ee, eee){
                    console.log("Edit Row");
                    e.grid.store.save();
                }
            }
        });
        var pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: landLordStore,
            displayInfo: true,
            displayMsg: 'نمایش رکورد {0} تا {1} از {2} رکورد',
            emptyMsg: "داده ای یافت نشد.",
        });
        var filterBar = Ext.create('Ext.ux.grid.FilterBar',{renderHidden: false});
        var gridPanel = Ext.create('Ext.grid.Panel', {
            store: landLordStore,
            rtl: true,
            plugins: [filterBar, rowEditing],
            border: false,
            cls: 'landLordGrid',
            region: 'center',
            columns: {
                plugins: [{
                        ptype: 'gridautoresizer'
                }],
                items: [
                    { text: 'ردیف',xtype: 'rownumberer', width: 60, align: 'center',height: 20 },
                    { text: 'نام', dataIndex: 'FirstName', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نام خانوادگی', dataIndex: 'LastName', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نام پدر', dataIndex: 'DadName', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'آدرس', dataIndex: 'Address', width: 220, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'توضیحات', dataIndex: 'Description', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'شرکا', dataIndex: 'Sharers', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true }
                ]},
            viewConfig: {
                stripeRows: true
            },
            bbar: [pagingToolbar,'->', {
                text: 'افزودن مالک',
                iconCls: 'landLord-add',
                handler : function() {
                    rowEditing.cancelEdit();

                    // Create a model instance
                    var r = Ext.create('LandLordModel');

                    landLordStore.insert(0, r);
                    rowEditing.startEdit(0, 0);
                }
            }]
        });
        gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                me.userId =  selectedRecord[0].raw.id;
                layer.refresh();
                //map.zoomToExtent(layer.getDataExtent());
            }
        });
        
        // ------------ Land Panel ------------
        
        var suggestPriceField = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'suggestPrice',
            fieldLabel: 'قیمت پیشنهادی(به ریال)',
            allowBlank: false
        });
        var description = Ext.create('Ext.form.field.TextArea', {
            width: 400,
            name: 'description',
            fieldLabel: 'توضیحات'
        });
        var pricePanel1 = Ext.widget('form', {
            region: "south",
            title: "افزودن به لیست خرید",
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 4,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            items: [
                {
                    xtype: 'fieldcontainer', 
                    items: [suggestPriceField]
                }, {
                    xtype: 'fieldcontainer',
                    items: [description]
                }],
            buttons: [{
                text: 'بی خیال',
                handler: function(){
                    pricePanel.setVisible(false);
                    segmentGridPanel.setVisible(true);
                    
                }
            }, {
                text: 'ارسال',
                disabled: true,
                formBind: true,
                handler: function(){
                    this.up('form').getForm().submit({
                        url: 'index.php?r=business/landsell',
                        params: plateCode,
                        submitEmptyText: false,
                        waitMsg: 'Saving Data...',
                        success: function(form, action) {
                           Ext.Msg.alert('success', action.result.success);
                           win.close();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failed', "not recived");
                        }
                    });
                }
            }]
        }).setVisible(false);
        var pricePanel= Ext.widget('form', {
                items: [{
                    xtype: 'fieldcontainer', 
                    items: [suggestPriceField]
                },{
                    xtype: 'fieldcontainer', 
                    items: [description]
                }],
                region: "south",
                 title: "افزودن به لیست خرید",
                layout: {type: 'vbox',align: 'stretch'},
                bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
                border: false,
                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 150,
                    labelStyle: 'font-weight:bold'
                },
                bodyPadding: 4,
                buttons: [{
                    text: 'بی خیال',
                    handler: function(){
                        pricePanel.setVisible(false);
                        segmentGridPanel.setVisible(true);

                    }
                }, {
                    text: 'ارسال',
                    disabled: true,
                    formBind: true,
                    handler: function(){
                        this.up('form').getForm().submit({
                            url: 'index.php?r=business/landsell',
                            params: plateCode,
                            submitEmptyText: false,
                            waitMsg: 'Saving Data...',
                            success: function(form, action) {
                               Ext.Msg.alert('success', action.result.success);
                               //win.close();
                               pricePanel.setVisible(false);
                               segmentGridPanel.setVisible(true);
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Failed', "not recived");
                            }
                        });
                    }
                }]
            }).setVisible(false);
            
        var plateCode = {gid: ''};
        var addToShopBtn =Ext.create('Ext.Button', {
            text: 'افزودن به لیست خرید',
            iconCls: 'landLord-add',
            handler: function() {
                if(segmentGridPanel.getSelectionModel().getSelection().length < 1) return;
                
                plateCode.gid = segmentGridPanel.getSelectionModel().getSelection()[0].data.gid;
                console.log("gid: " + plateCode.gid);
                segmentGridPanel.setVisible(false);
                pricePanel.setVisible(true);
                
            }
        });
        
        layer = new OpenLayers.Layer.Vector("لایه استان", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                //params: me,
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        
        layer.events.register('loadend', this, myFunc);
        
        var store = Ext.create('GeoExt.data.FeatureStore', {
            layer: layer,
            fields: [
                {name: 'gid', type: 'int'},
                {name: 'areaPlat',  type: 'float'},
                {name: 'price',  type: 'float', sortable: false, menuDisabled: true},
                {name: 'waterType',  type: 'string'},
                {name: 'plantType',  type: 'string'},
                {name: 'villageName',  type: 'string'},
                {name: 'X',  type: 'float'},
                {name: 'Y',  type: 'float'},
                {name: 'sheetNo',  type: 'string'},
                {name: 'numAdjacent',  type: 'int'},
                {name: 'villageName',  type: 'string'},
                {name: 'usingType',  type: 'string'},
                {name: 'position',  type: 'string'},
                {name: 'HeaatiAcre',  type: 'string'},
                {name: 'PublicSource',  type: 'string'},
                {name: 'docStatus',  type: 'string'}
            ],
            autoLoad: true
        });
        var lordRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            listeners: {
                cancelEdit: function(rowEditing, context) {
                    if (context.record.phantom) {
                        lordDetailStore.remove(context.record);
                    }
                },
                edit: function(e, ee, eee){
                    console.log("Edit Row");
                    e.grid.store.save();
                }
            }
        });
        var segmentGridPanel = Ext.create('Ext.grid.GridPanel', {
            region: "south",
            store: store,
            split: true,
            height: 150,
            columns: [
                {xtype: 'rownumberer',width: 30,sortable: false},
                { text: 'کد',  dataIndex: 'gid', width: 60, field: {xtype: 'textfield'}, sortable: true, menuDisabled: true, align: 'center'},
                { text: 'مساحت', dataIndex: 'areaPlat', width: 110, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'قیمت', dataIndex: 'price', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center'  },
                { text: 'نوع آبیاری', dataIndex: 'waterType',width: 60, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'نوع کشت', dataIndex: 'plantType', width: 80, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'نام روستا', dataIndex: 'villageName', width: 160, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'x', dataIndex: 'X', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'y', dataIndex: 'Y', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'شماره شیت', dataIndex: 'sheetNo', width: 65, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'تعداد مجاورت', dataIndex: 'numAdjacent', width: 50, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'با سند', dataIndex: 'WithDocument', width: 50, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'نوع کاربری', dataIndex: 'usingType', width: 53, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'موقعیت', dataIndex: 'position', width: 70, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'ارازی هیئتی', dataIndex: 'HeaatiAcre', width:70, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'منابع ملی شده', dataIndex: 'PublicSource', width: 90, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'وضعیت زمین', dataIndex: 'docStatus', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },                
			],
            plugins: [lordRowEditing],
            selType: 'featuremodel',
            bbar: [addToShopBtn]
        });
        
        var addSegmentBtn = Ext.create('Ext.Button', {
            text: 'افزودن قطعه زمین',
            iconCls: 'landLord-add',
            handler : function() {
                lordRowEditing.cancelEdit();

                // Create a model instance
                var r = Ext.create('lordModel');

                lordDetailStore.insert(0, r);
                lordRowEditing.startEdit(0, 0);
            }
        });
        /////////////////////////////////////////////////////////////////////////////////
        var map = new OpenLayers.Map('Our map');

        var open_streetMap_wms = new OpenLayers.Layer.WMS(
            "OpenStreetMap WMS",
            "http://ows.terrestris.de/osm/service?",
            {layers: 'OSM-WMS'}
        );
        
        map.addLayers([open_streetMap_wms, layer]);
        
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            title: 'سلام بر مهدی',
            map: map,
            rtl: false,
            collapsible: true,
            region: "west",
            //height: 550,
            width: 300,
            zoom: 5,
            center: [55,32.2]
        });
        // ------------ Tree Panel ------------
        // ????????????????????????????????????
        // ????????????????????????????????????
        // ????????????????????????????????????
        // ------------------------------------
        
        this.panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [segmentGridPanel, gridPanel, mapPanel, pricePanel]
        });
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('Landlord-win');
        if(!win){
            var allDataGridPanel = new me.AllData();
            
            win = desktop.createWindow({
                id: 'Landlord-win',
                title:'همه داده ها',
                width:1300,
                rtl: true,
                height:300,
                iconCls: 'icon-grid',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                items: [allDataGridPanel.panel]
            });
        }
        return win;
    }
});

function myFunc(a, aa , aaa){
    b = a;
    bb = aa;
    bbb = aaa;
    a.object.map.zoomToExtent(a.object.getDataExtent());
    //console.log("in the name of Allah");
    //alert("help me ya Allah");
}