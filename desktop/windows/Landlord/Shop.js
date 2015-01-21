/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Shop', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.grid.Panel',
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
        'Ext.form.*',
        'Ext.form.field.PDate'

    ],
    id:'shop-win',

    init : function(){
        this.launcher = {
            text: 'ثبت خرید',
            iconCls:'icon-grid'
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
            return Ext.create('Ext.form.field.PDate', {
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
        var setMap = function(){
            var mousePositionCtrl = new OpenLayers.Control.MousePosition();
            map.addControl(mousePositionCtrl);

            var layerSwitcher = new OpenLayers.Control.LayerSwitcher();
            map.addControl(layerSwitcher);
            
            var open_streetMap_wms = new OpenLayers.Layer.WMS(
                "OpenStreetMap WMS",
                "http://ows.terrestris.de/osm/service?",
                {layers: 'OSM-WMS'}
            );
            
            var gmap = new OpenLayers.Layer.Google("Google Streets",{numZoomLevels: 20});
            var ghyb = new OpenLayers.Layer.Google("Google Hybrid",{type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20, isBaseLayer: true});
            var gsat = new OpenLayers.Layer.Google("Google Satellite",{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22});
            var gphy = new OpenLayers.Layer.Google("Google Physical",{type: google.maps.MapTypeId.TERRAIN});
            
            var AX_point = new OpenLayers.Layer.WMS(
                "کیلومتر",
                "index.php?r=WMS/getMap",
                {layers: 'AX-point', transparent: true},{
                    isBaseLayer: false,
                    format:"image/png",
                    opacity: 1.0
                }
            );

            var AX_line = new OpenLayers.Layer.WMS(
                "خط",
                "index.php?r=WMS/getMap",
                {layers: 'AX-line', transparent: true},{
                    isBaseLayer: false,
                    format:"image/png",
                    opacity: 1.0
                }
            );

            map.addLayers([ghyb, gsat, gphy, gmap, open_streetMap_wms, AX_line, AX_point]);
        };
        var featureselected = function(e){
            userId = e.feature.data.userId;
            gid = e.feature.data.gid;
			
			sentParam.gid = gid;
            lp.refresh();
            llp.refresh();
        };
        
        var sentParam = {userId:1};
        var Geographic = new OpenLayers.Projection("EPSG:4326");
        var Mercator = new OpenLayers.Projection("EPSG:900913");
        var map = new OpenLayers.Map('Our map', {
            numZoomLevels:21,
            projection: Mercator,
            displayProjection: Geographic
        });
        setMap();
        var layerSwitcher = new OpenLayers.Control.LayerSwitcher();
        map.addControl(layerSwitcher);
        var gid, userId;
        layer = new OpenLayers.Layer.Vector("لایه زمین ها(همراه با کل عارضه ها)", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            }),
            displayInLayerSwitcher: false
        });
        layer.events.register('featureselected', this, featureselected);
        
        var segmentsLayer = new OpenLayers.Layer.Vector("لایه قطعات یک زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                params: sentParam,
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            }), 
            displayInLayerSwitcher: false
        });
        map.addLayers([segmentsLayer, layer]);
        //segmentsLayer.styleMap = styleMap;
        //map.addLayer(segmentsLayer);
        var styleMapInit = function(){
            var segmentStyle = new OpenLayers.Style();
            var segmentRule = new OpenLayers.Rule({
                symbolizer: {
                    fillColor: '#0000FF', fillOpacity:.1,
                    strokeColor: 'black',
                    strokeWidth:2   
                }
            });
            segmentStyle.addRules([segmentRule]); 
            var segmentStyleMap = new OpenLayers.StyleMap({
                'default': segmentStyle
            });
            segmentsLayer.styleMap = segmentStyleMap;
            
            var layerStyle = new OpenLayers.Style();
            var layerRule = new OpenLayers.Rule({
                symbolizer: {
                    fillOpacity:.0, strokeColor: 'black', strokeWidth:1
                }
            });
            layerStyle.addRules([layerRule]); 
            var layerStyleMap = new OpenLayers.StyleMap({
                'default': layerStyle
            });
            layer.styleMap = layerStyleMap;
        };
        
        styleMapInit();
        var mapPanel = function (region){
            
            mf = new OpenLayers.Control.SelectFeature(layer);
            
            var enterCode = Ext.create('Ext.form.TextField', {
				width: 160,
				labelWidth: 110,
				name: 'enterCode',
				fieldLabel: 'شماره کد قطعه زمین',
			});
			
			var chooseBtn = Ext.create('Ext.Button', {
				text: 'انتخاب',
				renderTo: Ext.getBody(),
				handler: function() {
					userId = '';
					gid = enterCode.getValue();
					
					sentParam.gid = gid;
					lp.refresh();
					llp.refresh();
				}
			});
            //map.addLayers([globalImagery, open_streetMap_wms, wms3, wms4, AX_point, AX_line]);
            
            var panel = Ext.create('GeoExt.panel.Map', {
                title: 'نقشه',
                map: map,
                rtl: false,
                resizable: true,
                collapsible: true,
                region: region,
                //height: 550,
                width: 400,
                zoom: 5,
                center: [6122571.992777778,3489123.8364954195],
				tbar: [enterCode, chooseBtn]
            });

            this.setVisible = function(flag){
                panel.setVisible(flag);
            };
            this.getPanel = function(){
                return panel;
            };
        };
        var landLordPanel = function(region){
            var Param = {userId: '', gid: ''};
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
                    //extraParams: Param
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
                multiSelect: true,
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
                        var selected = gridPanel.getSelectionModel().getSelection();
                        for(var i=0;i<selected.length;i++){
                            window.params = {userId:selected[i].raw.id};
                            window.open('index.php?r=print/print');
                        }
                    }
                }]
            });

            gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
                if (selectedRecord.length) {
                    userId = selectedRecord[0].raw.id;
                    map.controls[4].deactivate();
                    map.addControls([mf]);
                    mf.activate();
                    console.log("Help me ya Allahs");
                    lp.refresh();
                }
            });

            this.setVisible = function(flag){
                gridPanel.setVisible(flag);
            };
            this.getPanel = function (){
                return gridPanel;
            };
            
            this.refresh = function(){
				var me1={};
				if(userId != null)
					me1.userId = userId;
				if(gid != null)
					me1.gid = gid;
                landLordStore.load({params: me1});
				Param.userId = me1.userId;
				Param.gid = me1.gid;
            };
        };
        var landPanel = function(region){
            var loadEnd = function(e){
                if(e.response.features.length<1) return;
                map.zoomToExtent(segmentsLayer.getDataExtent());
            };
            
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
				if(userId == null || userId === "")
					delete sentParam['userId'];
				else
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
        
        var lp = new landPanel("south");
        var mp = new mapPanel('west');
        var llp = new landLordPanel('center');
        
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
            return gid;
        };
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('shop-win');
        if(!win){
            
            var gid;
            var chooseLandPanel = new me.chooseLand(me);
            var shoppingPanel = new me.shopping();
            
            var selectLandBtn = Ext.create('Ext.Button', {
                text: 'ثبت خرید جدید',
                iconCls: 'arrow-right-Btn',
                iconAlign: 'right',
                handler : function(){
                    gid = chooseLandPanel.getGid();
                    console.log("gid: " + gid);
                    if(gid === undefined){
                        Ext.Msg.alert('Failed', 'لطفا یک قطعه زمین را انتخاب کنید');
                        return;
                    }
                    chooseLandPanel.setPanelVisible(false);
                    shoppingPanel.setPanelVisible(true);
                    selectLandBtn.setVisible(false);
                    regInfoBtn.setVisible(true);
                    regInfoBackBtn.setVisible(true);
                }
            });
            var regInfoBtn = Ext.create('Ext.Button', {
                text: 'ذخیره اطلاعات',
                iconCls: 'arrow-right-Btn',
                iconAlign: 'right',
                handler : function(){
                    if(!shoppingPanel.formValidation()){
                        Ext.Msg.alert('Failed', 'لطفا در ورود اطلاعات دقت فرمایید');
                        return;
                    }
                    shoppingPanel.getPanel().getForm().submit({
                        url: 'index.php?r=business/buy',
                        params: {gid: gid},
                        submitEmptyText: false,
                        waitMsg: 'درد حال ذخیره اطلاعات ...',
                        success: function(form, action) {
                            var uploadPanel = new me.uploading(gid);
                            win.add(uploadPanel.getPanel());
                            win.items.items[1].setVisible(false);
                            //win.items.items[2].setVisible(true);
                            Ext.Msg.alert('success', action.result.success);
                            regInfoBtn.setVisible(false);
                            uploadBackBtn.setVisible(true);
                            regInfoBackBtn.setVisible(false);
                            uploadPanel.setPanelVisible(true);
                            selectLandBtn.setVisible(false);
                            regInfoBackBtn.setVisible(false);
                            hasEstelam.setVisible(true);
                            hasEsteshhad.setVisible(true);
                            hasMadarek.setVisible(true);
                            hasMap.setVisible(true);
                            hasQabz.setVisible(true);
                            hasSanad.setVisible(true);
                            hasTayeediyeShura.setVisible(true);
                            refreshHasImages();
                            //uploadPanel.setGid(gid);
                        },
                        failure: function(form, action) {
                            f = form;
                            a = action;
                            //Ext.Msg.alert('Failed', action.response.responseText);
                        }
                    });
                }
            }).setVisible(false);
            var regInfoBackBtn = Ext.create('Ext.Button', {
                text: 'بازگشت به انتخاب قطعه زمین',
                iconCls: 'arrow-left-Btn',
                handler : function(){
                    
                    chooseLandPanel.setPanelVisible(true);
                    shoppingPanel.setPanelVisible(false);
                    
                    selectLandBtn.setVisible(true);
                    regInfoBtn.setVisible(false);
                    regInfoBackBtn.setVisible(false);
                }
            }).setVisible(false);
            
            var uploadBackBtn = Ext.create('Ext.Button', {
                text: 'بازگشت به ویرایش اطلاعات',
                iconCls: 'arrow-left-Btn',
                handler : function(){
                    deleteRegister(gid);
                    regInfoBackBtn.setVisible(true);
                    uploadBackBtn.setVisible(false);
                    chooseLandPanel.setPanelVisible(false);
                    shoppingPanel.setPanelVisible(true);
                    selectLandBtn.setVisible(false);
                    regInfoBtn.setVisible(true);
                    regInfoBackBtn.setVisible(true);
                    hasEstelam.setVisible(false);
                    hasEsteshhad.setVisible(false);
                    hasMadarek.setVisible(false);
                    hasMap.setVisible(false);
                    hasQabz.setVisible(false);
                    hasSanad.setVisible(false);
                    hasTayeediyeShura.setVisible(false);
                }
            });
            uploadBackBtn.setVisible(false);
            
            var refreshHasImages = function(){
                Ext.Ajax.request({
                    url: 'index.php?r=business/updateshop',
                    params: {
                        gid: gid,
                        hasEsteshhad: hasEsteshhad.checked,
                        hasMap: hasMap.checked,
                        hasEstelam: hasEstelam.checked,
                        hasMadarek: hasMadarek.checked,
                        hasSanad: hasSanad.checked,
                        hasTayeediyeShura: hasTayeediyeShura.checked,
                        hasQabz: hasQabz.checked
                    },
                    success: function(response){
                        text = response;
                        // process server response here
                    }
                });
            };
            var deleteRegister = function(gid_){
                Ext.Ajax.request({
                    url: 'index.php?r=business/delete',
                    params: {
                        gid: gid
                    },
                    success: function(response){
                        text = response;
                    }
                });
            };
            
            var getCheckBox = function(name, boxLabel, checked){
                var that = Ext.create('Ext.form.field.Checkbox', {
                    name: name,
                    boxLabel: boxLabel,
                    checked: checked, 
                    listeners: {
                        click: {
                            element: 'el', //bind to the underlying el property on the panel
                            fn: function(){
                                refreshHasImages();
                                //landLordStore.proxy.extraParams[name] = that.checked;
                                //landLordStore.reload();
                            }
                        }
                    }
                }).setVisible(false);

                return that;
            };
            
            var hasEsteshhad = getCheckBox('hasEsteshhad', 'استشهادنامه', true);
            var hasMap = getCheckBox('hasMap', 'نقشه', true);
            var hasEstelam = getCheckBox('hasEstelam', 'استعلام', true);
            var hasMadarek = getCheckBox('hasMadarek', 'مدارک', true);
            var hasSanad = getCheckBox('hasSanad', 'سند', true);
            var hasTayeediyeShura = getCheckBox('hasTayeediyeShura', 'تاییدیه شورا', true);
            var hasQabz = getCheckBox('hasQabz', 'قبض', true);
            
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
                items: [ chooseLandPanel.getPanel(), shoppingPanel.getPanel()],
                bbar: [uploadBackBtn, regInfoBackBtn, '->', selectLandBtn, regInfoBtn],
                rbar: [hasEsteshhad, hasMap, hasEstelam, hasMadarek, hasSanad, hasTayeediyeShura, hasQabz]
            });
        }
        return win;
    }
});
