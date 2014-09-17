/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.AddSegment', {
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
        
        'Ext.window.MessageBox',
        'Ext.tree.plugin.TreeViewDragDrop',
        'Ext.layout.container.Border',
        'Ext.selection.CellModel',
        'Ext.container.Viewport',
        'Ext.window.MessageBox',
        'Ext.state.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.form.*',
        'Ext.tip.*'

    ],
    id:'addSegment-win',

    init: function(){
        this.launcher = {
            text: 'افزودن قطعه زمین',
            iconCls:'changePassword-16x16'
        };
    },
    
    getFieldForm: function(win){
        var required = '<span style="color:red;font-weight:bold" data-qtip="این فیلد ضروری می باشد">*</span>';
        
        var waterTypeStore = Ext.create('Ext.data.Store', {
            fields: ['type'],
            data : [{"type":"آبی"},{"type":"دیم"}]
        });
        
        var waterType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'نوع آبیاری',
            store: waterTypeStore,
            name: 'waterType',
            queryMode: 'local',
            displayField: 'type',
            valueField: 'type'
        });
        
        var plantTypeStore = Ext.create('Ext.data.Store', {
            fields: ["type"],
            data : [{"type":"گندم صیفی جات"},{"type":"نخلستان"},{"type":"بدون کشت"},{"type":"کشت"},{"type":"فرودگاه"},
                    {"type":"زمین فوتبال"},{"type":"مخروبه"}
            ]
        });
        
        var plantType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'نوع آبیاری',
            store: plantTypeStore,
            name: 'plantType',
            queryMode: 'local',
            displayField: "type",
            valueField: "type"
        });
        
        var positionStore = Ext.create('Ext.data.Store', {
            fields: ["type"],
            data : [{"type":"داخل محدوده"},{"type":"سمت چپ محدوده"},{"type":"سمت راست محدوده"},{"type":"بیرون محدوده"},
                    {"type":"داخل محدوده-2"},{"type":"داخل محدوده-1"}
            ]
        });
        
        var position = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'موقعیت',
            store: positionStore,
            name: 'position',
            queryMode: 'local',
            displayField: "type",
            valueField: "type"
        });
        
        var price = Ext.create('Ext.form.field.Text',{
            name: 'price',
            fieldLabel: 'قیمت'
        });
        
        var sheetNo = Ext.create('Ext.form.field.Text',{
            name: 'sheetNo',
            fieldLabel: 'شماره شیت'
        });
        
        var numAdjacent = Ext.create('Ext.form.field.Text',{
            name: 'numAdjacent',
            fieldLabel: 'تعداد مجاورت'
        });
        
        var usingTypeStore = Ext.create('Ext.data.Store', {
            fields: ['type'],
            data : [{"type":"ورزشی"},{"type":"مزروعی"}, {"type": "صنعتی"}, {"type": "بایر"}, {"type": "فرودگاه"},
                    {"type": "مرتع"}]
        });
        
        var usingType = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'نوع کاربری',
            name: 'usingType',
            store: usingTypeStore,
            queryMode: 'local',
            displayField: 'type',
            valueField: 'type'
        });
        
        var panel = Ext.widget('form', {
            region: 'south',
            layout: {
                type: 'vbox',
                //align: 'stretch'
            },
            border: false,
            bodyPadding: 4,
            height: 300,
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            items: [usingType,sheetNo, numAdjacent, position, plantType, waterType],
            buttons: [{
                text: 'ثبت قطعه زمین',
                formBind: true,
                handler: function(){
                    this.up('form').getForm().submit({
                        url: 'index.php?r=land/create',
                        params: {geoText: win.getGeoText()},
                        submitEmptyText: false,
                        waitMsg: 'Saving Data...',
                        success: function(form, action) {
                           Ext.Msg.alert('success', action.result.success);
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failed', action.response.responseText);
                        }
                    });
                }
            }]
        })
        
        /*var formPanel = Ext.create('Ext.panel.Panel', {
            bodyPadding: 5,  // Don't want content to crunch against the borders
            region: 'south',
            title: 'ویژگیهای قطعه زمین',
            titleAlign: 'right',
            items: [usingType, numAdjacent, position, plantType, waterType]
        });*/
        
        this.setVisible = function(flag){
            panel.setVisible(flag);
        };
        
        return panel;
    },
    
    mapPanel: function(win){
        var beforefeatureadded = function(e, ee, eee){
            drawLayer.removeAllFeatures();
            intersectionLayer.removeAllFeatures();
        };
        var intersectionTestCallBack = function(){
            //alert("in the name of Allah - Help me ya Allah");
            var createText2SendServer = function(){
                alert("salam bar mahdi");
                var components = drawLayer.features[0].geometry.components[0].components;
                var geoText = "MULTIPOLYGON(((";
                for(var i=0; i<components.length; i++)
                    geoText += components[i].x + ' ' + components[i].y + ',';
                
                geoText = geoText.slice(0, geoText.length-1);
                geoText += ')))';
                return geoText;
            };
            win.setGeoText(createText2SendServer());
            Ext.Ajax.request({
                url: '?r=land/Intersection',
                params: {
                    geoText: win.getGeoText()
                },
                success: function(response){
                    text = response.responseText;
                    text = eval('(' + text + ')');
                    if(text.features.length<1){
                        alert("السلام علیک یا سیدالشهدا - سلام بر لب تشنه ات یا حسین(علیه السلام) - هیچ گونه تداخلی صورت نگرفته است");
                    }else{
                        alert("قطعه شما با قطعات دیگر تداخل دارد.");
                        
                        var features = text.features;
                        var i = 0;
                        
                        intersectionLayer.removeAllFeatures();
                        while(i<features.length){
                            var points = features[i].geometry.coordinates[0][0];
                            var geoPoints = [];
                            var j = 0;
                            while(j<points.length){
                                geoPoints.push(new OpenLayers.Geometry.Point(points[j][0], points[j][1]));
                                j++;
                            }
                            i++;
                            intersectionLayer.addFeatures([
                                new OpenLayers.Feature.Vector(
                                    new OpenLayers.Geometry.Polygon(
                                        new OpenLayers.Geometry.LinearRing(geoPoints)
                                    )
                                )
                            ]);
                            intersectionLayer.redraw();
                        }
                    }
                }
            });
        };
        var stylePanel = function(){
            var intersectionStyle = new OpenLayers.Style();
            var intersectionRule = new OpenLayers.Rule({
                symbolizer: {
                    fillColor: '#ffdcb9', fillOpacity:.8,
                    pointRadius:5, strokeColor: '#f0bd95',
                    strokeWidth:2
                }
            });
            intersectionStyle.addRules([intersectionRule]); 
            var intersectionStyleMap = new OpenLayers.StyleMap({
                'default': intersectionStyle
            });
            
            var layerStyle = new OpenLayers.Style();
            var layerRule = new OpenLayers.Rule({
                symbolizer: {
                    fillColor: '#7AFF00', fillOpacity:.3,
                    pointRadius:5, strokeColor: '#00FFFF',
                    strokeWidth:2
                }
            });
            layerStyle.addRules([layerRule]); 
            var layerStyleMap = new OpenLayers.StyleMap({
                'default': layerStyle
            });
            
            var allSegmentsStyle = new OpenLayers.Style();
            var allSegmentsRule = new OpenLayers.Rule({
                symbolizer: {
                    fillColor: '#00FF1F', fillOpacity:.3,
                    pointRadius:5, strokeColor: '#0000FF',
                    strokeWidth:2
                }
            });
            allSegmentsStyle.addRules([allSegmentsRule]); 
            var allSegmentsStyleMap = new OpenLayers.StyleMap({
                'default': allSegmentsStyle
            });
            
            this.getIntersectionStyleMap = function(){
                return intersectionStyleMap;
            };
            this.allSegmentsStyleMap = function(){
                return allSegmentsStyleMap;
            };
            this.layerStyleMap = function(){
                return layerStyleMap;
            };
        };
        var loadEnd = function(e){
            if(e.response.features.length<1) return;
            map.zoomToExtent(segmentLayer.getDataExtent());
        };
        var geoText = '';
        var st = new stylePanel();
        var userId = {userId: 0};
        var map = new OpenLayers.Map('Our map', {numZoomLevels:21});
        var mousePositionCtrl = new OpenLayers.Control.MousePosition();
        map.addControl(mousePositionCtrl);
        
        var open_streetMap_wms = new OpenLayers.Layer.WMS(
            "OpenStreetMap WMS",
            "http://ows.terrestris.de/osm/service?",
            {layers: 'OSM-WMS'}
        );
        layer = new OpenLayers.Layer.Vector("لایه استان", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        
        drawLayer = new OpenLayers.Layer.Vector("از این لایه برای رسم پلی گن ها استفاده می کنیم");
        drawLayer.events.register('featureadded', this, intersectionTestCallBack);
        drawLayer.events.register('beforefeatureadded', this, beforefeatureadded);

        segmentLayer = new OpenLayers.Layer.Vector("لایه قطعات یک زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                params: userId,
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        segmentLayer.events.register('loadend', this, loadEnd);
        intersectionLayer = new OpenLayers.Layer.Vector("لایه ی تداخل");
        layer.styleMap = st.layerStyleMap();
        segmentLayer.styleMap = st.allSegmentsStyleMap();
        intersectionLayer.styleMap = st.getIntersectionStyleMap();
        map.addLayers([open_streetMap_wms, layer, drawLayer, segmentLayer, intersectionLayer]);
        var toolbarItems = [];
        
        var drawPolygon = Ext.create('GeoExt.Action', {
            text: "رسم پلی گن",
            control: new OpenLayers.Control.DrawFeature(drawLayer, OpenLayers.Handler.Polygon),
            handler: function (btn){
                if(btn.pressed){
                }
            },
            map: map,
            toggleGroup: "draw",
            allowDepress: true,
            tooltip: "draw line",
            group: "draw"
        });
        toolbarItems.push(Ext.create('Ext.button.Button', drawPolygon));
        var modifyAction = Ext.create('GeoExt.Action', {
            text: "ویرایش نقاط",
            control: new OpenLayers.Control.ModifyFeature(drawLayer),
            map: map,
            toggleGroup: "draw",
            allowDepress: true,
            tooltip: "ویرایش نقاط افزوده شده به نقشه",
            group: "draw"
        });
        toolbarItems.push(Ext.create('Ext.button.Button', modifyAction));
        var addPolygon = Ext.create('Ext.Button', {
            text: 'افزودن با استفاده از نقاط',
            handler: function() {
                Ext.Msg.prompt('افزودن یک قطعه با استفاده از نقاط موجود',
                               'لطفا نقاط خود را مانند مثال درون کادر زیر وارد نمایید<br>"x1,y1 x2,y2 x3,y3, ..." :فرمت ورود اطلاعات', 
                               function(btn, text){
                                    if (btn == 'ok'){
                                        drawLayer.removeAllFeatures();
                                        intersectionLayer.removeAllFeatures();
                                        var geoPoints = [];
                                        var points = text.split(" ");
                                        var i = 0;
                                        while(i<points.length){
                                            var point = points[i].split(",");
                                            geoPoints.push(
                                                    new OpenLayers.Geometry.Point(parseFloat(point[0]), parseFloat(point[1]))
                                            );
                                            i++;
                                        };
                                        
                                        drawLayer.addFeatures([
                                            new OpenLayers.Feature.Vector(
                                                new OpenLayers.Geometry.Polygon(
                                                    new OpenLayers.Geometry.LinearRing(geoPoints)
                                                )
                                            )
                                        ]);
                                        drawLayer.redraw();
                                    }
                                }, 
                                this,
                                80,
                                '55.803161797162,28.227430945601 55.804197129842,28.226508265699 55.804701385136,28.227414852346 55.803161797162,28.227430945601'
                );
            }
        });
        toolbarItems.push(addPolygon);
        var intersectionTestBtn = Ext.create('Ext.Button', {
            text: 'آزمایش تداخل',
            handler: intersectionTestCallBack
        });
        toolbarItems.push(intersectionTestBtn);
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            //title: 'افزودن با استفاده از نقشه',
            map: map,
            rtl: false,
            //resizable: true,
            //collapsible: true,
            region: "center",
            width: 400,
            zoom: 5,
            center: [55,32.2],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: toolbarItems
            }]
        }).setVisible(true);
        
        this.setUserId = function(id){
            userId.userId = id;
            segmentLayer.refresh();
        };
        this.getPanel = function(){
            return mapPanel;
        };
    },
    
    landLord: function(win){
        var landLordModel = Ext.define('LandLordModel', {
            extend: 'Ext.data.Model',
            fields: [
                //{name: 'LinkCode', type: 'int'},
                {name: 'FirstName', type: 'string'},
                {name: 'LastName',  type: 'string'},
                {name: 'DadName',       type: 'string'}
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
        
        var pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: landLordStore,
            displayInfo: true,
            displayMsg: 'نمایش رکورد {0} تا {1} از {2} رکورد',
            emptyMsg: "داده ای یافت نشد.",
        });
        var filterBar = Ext.create('Ext.ux.grid.FilterBar',{renderHidden: false, showShowHideButton: true,showClearAllButton: true});
        var gridPanel = Ext.create('Ext.grid.Panel', {
            store: landLordStore,
            title: 'لطفا نام مالک را انتخاب کنید',
            titleAlign: 'right',
            bodyStyle: {direction: 'ltr'},
            plugins: [filterBar],
            resizable: true,
            width: 400,
            //height: 200,
            border: false,
            cls: 'landLordGrid',
            region: 'east',
            columns: {
                plugins: [{
                        ptype: 'gridautoresizer'
                }],
                items: [
                    { text: 'نام پدر', dataIndex: 'DadName', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نام خانوادگی', dataIndex: 'LastName', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نام', dataIndex: 'FirstName', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'ردیف',xtype: 'rownumberer', width: 40, align: 'center',height: 20 },
                ]},
            viewConfig: {
                stripeRows: true
            },
            bbar: [pagingToolbar]
        });
        gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                win.setUserId(parseInt(selectedRecord[0].raw.id));
            }
        });
        
        this.getPanel = function(){
            return gridPanel;
        };
        
    },
    
    window: function(myThis){
        
        var geoText = '';
        
        var desktop = myThis.app.getDesktop();
        var me = myThis;
        var win = desktop.getWindow('addSegment-win');
        
        var myMapPanel = new me.mapPanel(this);
        var landLord = new me.landLord(this);
        var fieldFormPanel = new me.getFieldForm(this);
        
        
        this.setPanelVisible = function(mapPanelVisible, polygonPanelVisible, fieldFormPanelVisible){
            myMapPanel.setVisible(mapPanelVisible);
            landLord.setVisible(polygonPanelVisible);
            fieldFormPanel.setVisible(fieldFormPanelVisible);
        };

        if(!win){
            var panel = Ext.create('Ext.Panel', {
                layout: 'border',
                items: [myMapPanel.getPanel(), landLord.getPanel(), fieldFormPanel]
            });
            win = desktop.createWindow({
                id: 'addSegment-win',
                title:'افزودن قطعه زمین',
                width:900,
                rtl: true,
                height:500,
                iconCls: 'changePassword-16x16',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: {
                    type: 'fit',
                    align: 'left'
                },
                items: [panel]
            });
        }
        
        this.setGeoText = function(gt){
            geoText = gt;
        };
        
        this.getGeoText = function(){
            return geoText;
        };
        
        this.getWin = function (){
            return win;
        };
        
        this.setFieldFormPanelVisible = function (flag) {
            fieldFormPanel.setVisible(flag);
        };
        
        this.closeWin = function (){
            win.close();
        };
        
        this.setUserId = function(id){
            myMapPanel.setUserId(id);
        };
    },
    
    
    createWindow: function(){
        
        window1 = new this.window(this);
        
        return window1.getWin();
    }
});