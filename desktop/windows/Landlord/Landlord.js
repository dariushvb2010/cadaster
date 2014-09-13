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
    
    landLord: function(region, land){
        var userId = 1;
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
            pageSize: 15,
            proxy: {
                type: 'ajax',
                url: 'index.php?r=landlord/AllLandlord',
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
            region: region,
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
                text: 'پرینت',
                iconCls: 'print-icon-16x16',
                handler : function() {
                    window.params = {userId:userId};
                    window.open('index.php?r=print/print', '_blank');
                }
            }]
        });
        
        gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                userId = selectedRecord[0].raw.id;
                land.setUserId(userId);
            }
        });
        
        this.setVisible = function(flag){
            gridPanel.setVisible(flag)
        };
        this.getPanel = function (){
            return gridPanel;
        };
    },
    land: function(region, allData){
        var sentParam = {userId: 1};
        var lastSelectedSegmentId = 0;
        var loadEnd = function(e){
            if(e.response.features.length<1) return;
            map.zoomToExtent(segmentsLayer.getDataExtent());
        };
        
        var style = new OpenLayers.Style();
        var rule = new OpenLayers.Rule({
            symbolizer: {
                fillColor: '#ababab', fillOpacity:.8,
                pointRadius:5, strokeColor: '#151515',
                strokeWidth:2
            }
        });
        style.addRules([rule]); 
        var styleMap = new OpenLayers.StyleMap({
            'default': style
        });
        
        var segmentsLayer = new OpenLayers.Layer.Vector("لایه قطعات یک زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                params: sentParam,
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        segmentsLayer.styleMap = styleMap;
        
        segmentsLayer.events.register('loadend', this, loadEnd);
        var addToShopBtn = Ext.create('Ext.Button', {
            text: 'افزودن به لیست خرید',
            iconCls: 'landLord-add',
            handler : function(){
                allData.setVisible(false, false, false, true );
                //console.log('');
                /*lordRowEditing.cancelEdit();
                // Create a model instance
                
                var r = Ext.create('lordModel');
                
                lordDetailStore.insert(0, r);
                lordRowEditing.startEdit(0, 0);*/
            }
        });
        var store = Ext.create('GeoExt.data.FeatureStore', {
            layer: segmentsLayer,
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
        var segmentGridPanel = Ext.create('Ext.grid.GridPanel', {
            region: region,
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
            //plugins: [landRowEditing],
            selType: 'featuremodel',
            bbar: [addToShopBtn]
        });
        segmentGridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                lastSelectedSegmentId = selectedRecord[0].data.gid;
                //land.setUserId(userId);
            }
        });
        this.getLayer = function(){
            return segmentsLayer;
        };
        this.getPanel = function(){
            return segmentGridPanel;
        };
        
        this.setUserId = function(userId){
            sentParam.userId = userId;
            segmentsLayer.refresh();
        };
        this.setVisible = function(flag){
            segmentGridPanel.setVisible(flag);
        }
        this.getLastSelectedSegmentId = function(){
            return lastSelectedSegmentId;
        }
        
    },
    
    map: function (region){
        map = new OpenLayers.Map('Our map',{numZoomLevels:21});

        var open_streetMap_wms = new OpenLayers.Layer.WMS(
            "OpenStreetMap WMS",
            "http://ows.terrestris.de/osm/service?",
            {layers: 'OSM-WMS'}
        );
        var globalImagery = new OpenLayers.Layer.WMS(
            "Global Imagery",
            "http://maps.opengeo.org/geowebcache/service/wms",
            {layers: "bluemarble"}
        );
        var layer = new OpenLayers.Layer.Vector("لایه استان", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        
        map.addLayers([globalImagery, layer]);
        
        var panel = Ext.create('GeoExt.panel.Map', {
            title: 'نقشه',
            map: map,
            rtl: false,
            collapsible: true,
            region: region,
            //height: 550,
            width: 400,
            zoom: 5,
            center: [55,32.2]
        });
        
        this.addLayer2Map = function(layer_){
            map.addLayers([layer_]);
        }
        this.setVisible = function(flag){
            panel.setVisible(flag);
        }
        this.getPanel = function(){
            return panel;
        }
    },
    shopping: function(land){
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
        var finalPrice = Ext.create('Ext.form.field.TextArea', {
            width: 400,
            name: 'finalPrice',
            fieldLabel: 'قیمت نهایی'
        });
        var state = Ext.create('Ext.form.field.TextArea', {
            width: 400,
            name: 'state',
            fieldLabel: 'وضعیت قطعه زمین'
        });
        var buyDate = Ext.create('Ext.form.field.TextArea', {
            width: 400,
            name: 'buyDate',
            fieldLabel: 'تاریخ خرید'
        });
        var panel = Ext.widget('form', {
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
                }, {
                    xtype: 'fieldcontainer',
                    items: [finalPrice]
                }, {
                    xtype: 'fieldcontainer',
                    items: [state]
                }, {
                    xtype: 'fieldcontainer',
                    items: [buyDate]
                }],
            buttons: [{
                text: 'بی خیال',
                handler: function(){
                    //pricePanel.setVisible(false);
                    //segmentGridPanel.setVisible(true);
                    
                }
            }, {
                text: 'ارسال',
                //disabled: true,
                formBind: true,
                handler: function(){
                    this.up('form').getForm().submit({
                        url: 'index.php?r=business/buy',
                        params: {gid: land.getLastSelectedSegmentId()},
                        submitEmptyText: false,
                        waitMsg: 'Saving Data...',
                        success: function(form, action) {
                           Ext.Msg.alert('success', action.result.success);
                           win.close();
                        },
                        failure: function(form, action) {
                            a = form;
                            b = action;
                            Ext.Msg.alert('Failed', action.result.failure);
                        }
                    });
                }
            }]
        }).setVisible(false);
        
        this.getPanel = function(){
            return panel;
        };
        this.setVisible = function(flag){
            panel.setVisible(flag);
        };
    },
    allData: function(rootThis){
        /////////////////////////////////////////////////////////////////////////////////
        
        var land = new rootThis.land("south", this);
        var shoppingPanel = new rootThis.shopping(land);
        var landLord = new rootThis.landLord("center", land);
        
        var map = new rootThis.map("west");
        
        map.addLayer2Map(land.getLayer());
        
        this.setVisible = function(landLordVisible, landVisible, mapVisible, shoppingVisible){
            landLord.setVisible(landLordVisible);
            land.setVisible(landVisible);
            map.setVisible(mapVisible);
            shoppingPanel.setVisible(shoppingVisible);
        };
        this.panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [ landLord.getPanel(), land.getPanel(), map.getPanel(), shoppingPanel.getPanel()]
        });
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('Landlord-win');
        if(!win){
            var allDataGridPanel = new me.allData(me);
            
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
    console.log("in the name of Allah");
    //alert("help me ya Allah");
}