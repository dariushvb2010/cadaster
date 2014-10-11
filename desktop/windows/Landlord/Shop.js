/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Shop', {
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
    id:'shop-win',

    init : function(){
        this.launcher = {
            text: 'ثبت خرید تستی',
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
            gridPanel.setVisible(flag);
        };
        this.getPanel = function (){
            return gridPanel;
        };
    },
    land: function(region, allData){
        var sentParam = {userId: 1};
        var gid = '';
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
                {xtype: 'rownumberer',width: 30,sortable: false, menuDisabled: false},
                { text: 'کد',  dataIndex: 'gid', width: 60, field: {xtype: 'textfield'}, sortable: true, menuDisabled: true, align: 'center'},
                { text: 'مساحت', dataIndex: 'areaPlat', width: 110, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'قیمت', dataIndex: 'price', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center'  },
                { text: 'نوع آبیاری', dataIndex: 'waterType',width: 60, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'نوع کشت', dataIndex: 'plantType', width: 80, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'روستا', dataIndex: 'villageName', width: 160, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'x', dataIndex: 'X', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'y', dataIndex: 'Y', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'شماره شیت', dataIndex: 'sheetNo', width: 65, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                { text: 'تعداد مجاورت', dataIndex: 'numAdjacent', width: 50, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'سند', dataIndex: 'WithDocument', width: 50, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'نوع کاربری', dataIndex: 'usingType', width: 53, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'موقعیت', dataIndex: 'position', width: 70, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'ارازی هیئتی', dataIndex: 'HeaatiAcre', width:70, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'منابع ملی شده', dataIndex: 'PublicSource', width: 90, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                { text: 'وضعیت زمین', dataIndex: 'docStatus', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },                
			],
            //plugins: [landRowEditing],
            selType: 'featuremodel'
        });
        segmentGridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                gid = selectedRecord[0].data.gid;
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
        };
        this.getGid = function(){
            return gid;
        };
    },
    
    shopping: function(){
        var getTextField = function(fieldLabel, name, value, allowBlank){
            var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
            if(allowBlank)
                return Ext.create('Ext.form.TextField', {
                    width: 250,
                    name: name,
                    fieldLabel: fieldLabel,
                    allowBlank: allowBlank,
                    value: value
                });
            else
                return Ext.create('Ext.form.TextField', {
                    width: 250,
                    name: name,
                    fieldLabel: fieldLabel,
                    allowBlank: allowBlank,
                    afterLabelTextTpl: required,
                    value: value
                });
        };
        var getDateField = function (fieldLabel, name){
            return Ext.create('Ext.form.field.Date', {
                anchor: '100%',
                fieldLabel: fieldLabel,
                name: name, 
                value: new Date()
            });
        };
        var mobayeNo = getTextField('شماره مبایعه نامه', 'mobayeNo', 123, false);
        var area = getTextField('مساحت', 'area', 1234, true);
        var pricePerMeter = getTextField('قیمت هر متر', 'pricePerMeter', 123, true);
        var finalPrice = getTextField('قیمت نهایی', 'finalPrice', 123*1234, true);
        var mobayeDate = getDateField('تاریخ مبایعه نامه', 'mobayeDate');
        var committeeNo = getTextField('شماره کمیته تملک اراضی', 'committeeNo', '123123', true);
        var committeeDate = getDateField('تاریخ کمیته تملک اراضی', 'committeeDate');
        var description = getTextField('توضیحات', 'description', 'این قسمت توضیحات میباشد.', true);
        
        var formPanel = Ext.widget('form', {
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
                    items: [mobayeNo]
                }, {
                    xtype: 'fieldcontainer',
                    items: [area]
                }, {
                    xtype: 'fieldcontainer',
                    items: [pricePerMeter]
                }, {
                    xtype: 'fieldcontainer',
                    items: [finalPrice]
                }, {
                    xtype: 'fieldcontainer',
                    items: [mobayeDate]
                }, {
                    xtype: 'fieldcontainer',
                    items: [committeeNo]
                }, {
                    xtype: 'fieldcontainer',
                    items: [committeeDate]
                }, {
                    xtype: 'fieldcontainer',
                    items: [description]
                }]
        }).setVisible(false);
        
        this.getPanel = function(){
            return formPanel;
        };
        this.setPanelVisible = function(flag){
            formPanel.setVisible(flag);
        };
        this.formValidation = function(){
            for(var i=0; i<formPanel.items.items.length; i++){
                if(!formPanel.items.items[i].items.items[0].isValid())
                    return false;
            }
            return true;
        };
    },
    uploading: function(gid){
        
        var getFileField = function(fieldLabel, emptyText, name){
            return Ext.create('Ext.form.field.File', {
                fieldLabel: fieldLabel,
                emptyText: emptyText,
                name: name,
                buttonText: 'انتخاب',
                buttonConfig: {
                    iconCls: 'upload-icon'
                }
            });
        };
        
        var esteshhad = getFileField('esteshhad', 'esteshhad', 'esteshhad');
        var map = getFileField('map', 'map', 'map');
        var estelam = getFileField('estelam', 'estelam', 'estelam');
        var madarek = getFileField('madarek', 'madarek', 'madarek');
        var sanad = getFileField('madarek', 'madarek', 'madarek');
        var tayeediyeShura = getFileField('tayeediyeShura', 'tayeediyeShura', 'tayeediyeShura');
        var qabz = getFileField('qabz', 'qabz', 'qabz');
        
        var panel = Ext.create('Ext.ux.upload.Panel', {
            width: 400,
            uploader: 'Ext.ux.upload.uploader.FormDataUploader',
            uploaderOptions: {
                url: 'index.php?r=business/upload&gid='+gid,
                //url: 'index.php?r=business/upload',
                //params: {gid: gid, userId: userId},
                timeout: 120*100
            }
        }).setVisible(true);
        
        this.getPanel = function(){
            return panel;
        };
        this.setPanelVisible = function(flag){
            panel.setVisible(flag);
        };
        this.setGid = function(gid_){
            gid = gid_;
        };
    },
    chooseLand: function(rootThis){
        map = new OpenLayers.Map('Our map',{numZoomLevels:21});
        var gid, userId;
        layer = new OpenLayers.Layer.Vector("لایه استان", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        
        var mapPanel = function (region){

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
            
            //mf = new OpenLayers.Control.SelectFeature(layer);
            //map.addControls([mf]);
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

            this.setVisible = function(flag){
                panel.setVisible(flag);
            };
            this.getPanel = function(){
                return panel;
            };
        };
        var landLordPanel = function(region){
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
            landLordStore = Ext.create('Ext.data.Store', {
                model: 'LandLordModel',
                pageSize: 15,
                proxy: {
                    type: 'ajax',
                    url: 'index.php?r=landlord/AllLandlord',
                    reader: {
                        type: 'json',
                        root: 'LandLordsDetail',
                        totalProperty: 'totalCount'
                    },
                    extraParams: {userId: userId}
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
                    lp.refresh();
                    //land.setUserId(userId);
                }
            });

            this.setVisible = function(flag){
                gridPanel.setVisible(flag);
            };
            this.getPanel = function (){
                return gridPanel;
            };
        };
        var landPanel = function(region){
            var sentParam = {userId: 1};
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
            map.addLayer(segmentsLayer);
            
            segmentsLayer.events.register('loadend', this, loadEnd);
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
                    {xtype: 'rownumberer',width: 30,sortable: false, menuDisabled: false},
                    { text: 'کد',  dataIndex: 'gid', width: 60, field: {xtype: 'textfield'}, sortable: true, menuDisabled: true, align: 'center'},
                    { text: 'مساحت', dataIndex: 'areaPlat', width: 110, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                    { text: 'قیمت', dataIndex: 'price', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center'  },
                    { text: 'نوع آبیاری', dataIndex: 'waterType',width: 60, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'نوع کشت', dataIndex: 'plantType', width: 80, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'روستا', dataIndex: 'villageName', width: 160, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'x', dataIndex: 'X', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                    { text: 'y', dataIndex: 'Y', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                    { text: 'شماره شیت', dataIndex: 'sheetNo', width: 65, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center', renderer : function(val) {return '<span style="font-family:Tahoma; font-size: 13px;">' + val + '</span>';}},
                    { text: 'تعداد مجاورت', dataIndex: 'numAdjacent', width: 50, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'سند', dataIndex: 'WithDocument', width: 50, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'نوع کاربری', dataIndex: 'usingType', width: 53, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'موقعیت', dataIndex: 'position', width: 70, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'ارازی هیئتی', dataIndex: 'HeaatiAcre', width:70, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'منابع ملی شده', dataIndex: 'PublicSource', width: 90, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },
                    { text: 'وضعیت زمین', dataIndex: 'docStatus', flex: 1, field: {xtype: 'textfield'}, sortable: false, menuDisabled: true, align: 'center' },                
                            ],
                //plugins: [landRowEditing],
                selType: 'featuremodel'
            });
            segmentGridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
                if (selectedRecord.length) {
                    gid = selectedRecord[0].data.gid;
                }
            });
            this.getLayer = function(){
                return segmentsLayer;
            };
            this.getPanel = function(){
                return segmentGridPanel;
            };

            this.refresh = function(){
                sentParam.userId = userId;
                segmentsLayer.refresh();
            };
            this.setVisible = function(flag){
                segmentGridPanel.setVisible(flag);
            };
            this.getGid = function(){
                return gid;
            };
        };
        
        var mp = new mapPanel('west');
        var llp = new landLordPanel('center');
        var lp = new landPanel("south");
        
        var panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [ mp.getPanel(), llp.getPanel(), lp.getPanel()]
        });
        
        this.getPanel = function(){
            return panel;
        };
        
        this.setPanelVisible = function(flag){
            panel.setVisible(flag);
        };
        
        this.getGid = function(){
            return land.getGid();
        };
    },
    allData: function(rootThis){
        /////////////////////////////////////////////////////////////////////////////////
        
        var land = new rootThis.land("south", this);
        //var shoppingPanel = new rootThis.shopping('north', land, this);
        var landLord = new rootThis.landLord("center", land);
        var map = new rootThis.map("west");
        //var uploading = new rootThis.uploading('north', land);
        
        map.addLayer2Map(land.getLayer());
        
        this.setVisible = function(landLordVisible, landVisible, mapVisible, shoppingVisible, uploadVisible){
            landLord.setVisible(landLordVisible);
            land.setVisible(landVisible);
            map.setVisible(mapVisible);
            //shoppingPanel.setVisible(shoppingVisible);
            //uploading.setVisible(uploadVisible);
        };
        this.panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [ landLord.getPanel(), land.getPanel(), map.getPanel()]
        });
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('shop-win');
        if(!win){
            //var allDataGridPanel = new me.allData(me);
            var gid;
            var chooseLandPanel = new me.chooseLand(me);
            
            win = desktop.createWindow({
                id: 'shop-win',
                title:'ثبت خرید',
                width:1300,
                rtl: true,
                height:400,
                iconCls: 'icon-grid',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                //items: [allDataGridPanel.panel],
                items: [ chooseLandPanel.getPanel()],
                //bbar: [regInfoBackBtn, uploadBackBtn, '->', addToShopBtn, regInfoBtn],
                //rbar: [hasEsteshhad, hasMap, hasEstelam, hasMadarek, hasSanad, hasTayeediyeShura, hasQabz]
            });
        }
        return win;
    }
});
