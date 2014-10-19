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
            fieldLabel: 'نوع کشت',
            store: plantTypeStore,
            name: 'plantType',
            queryMode: 'local',
            displayField: "type",
            valueField: "type",
            //allowBlank: false
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
       
        var panel = Ext.create('Ext.form.Panel', {
            //renderTo: Ext.getBody(),
            region: 'south',
            title: 'اطلاعات زمین',
            //bodyStyle: 'padding:5px 5px 5px 5px;direction: rtl',
            bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
            //width: 600,
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side'
            },
            titleAlign: 'rigth',
            defaults: {
                border: false,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor'
            },

            layout: 'hbox',
            items: [{
                items: [usingType, sheetNo],
                bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'}
            }, {
                items: [numAdjacent, position, plantType, waterType],
                bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
            }, {
                items: [plantType, waterType],
                bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
            }]
        });
        
        this.setVisible = function(flag){
            panel.setVisible(flag);
        };
        
        this.getPanel = function(){
            return panel;
        };
        
        this.formValidation = function(){
            for(var i=0; i<panel.items.items.length; i++){
                for(var j=0; j<panel.items.items[i].items.items.length; j++){
                    if(!panel.items.items[i].items.items[j].isValid())
                        return false;
                }
            }
            return true;
        };
    },
    
    mapPanel: function(win){
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
                "http://csicc2014.sbu.ac.ir:8080/geoserver/cadaster/wms?service=WMS",
                {layers: 'AX-point', transparent: true},{
                    isBaseLayer: false,
                    format:"image/png",
                    opacity: 1.0
                }
            );

            var AX_line = new OpenLayers.Layer.WMS(
                "خط",
                "http://csicc2014.sbu.ac.ir:8080/geoserver/cadaster/wms?service=WMS",
                {layers: 'AX-line', transparent: true},{
                    isBaseLayer: false,
                    format:"image/png",
                    opacity: 1.0
                }
            );

            map.addLayers([ghyb, gsat, gphy, gmap, open_streetMap_wms, AX_line, AX_point]);
        };
        var beforefeatureadded = function(e, ee, eee){
            drawLayer.removeAllFeatures();
            intersectionLayer.removeAllFeatures();
        };
        var intersectionTestCallBack = function(){
            var geoText = getGeoText();
            if(geoText === undefined){
                Ext.Msg.alert('خطا', 'لطفا یک قطعه به نقشه اضافه نمایید.');
                return;
            }
            Ext.Ajax.request({
                url: '?r=land/Intersection',
                params: {
                    geoText: geoText
                },
                success: function(response){
                    var text = response.responseText;
                    text = eval('(' + text + ')');
                    if(text.features.length<1){
                        //alert("السلام علیک یا سیدالشهدا - سلام بر لب تشنه ات یا حسین(علیه السلام) - هیچ گونه تداخلی صورت نگرفته است");
                        Ext.Msg.alert('موفقیت', 'هیچگونه تداخلی صورت نگرفته است');
                    }else{
                        var features = text.features;
                        var i = 0;
                        
                        intersectionLayer.removeAllFeatures();
                        while(i<features.length){
                            var points = features[i].geometry.coordinates[0][0];
                            var geoPoints = [];
                            var j = 0;
                            while(j<points.length){
                                var newPoint = new OpenLayers.Geometry.Point(points[j][0], points[j][1]);
                                geoPoints.push(newPoint.transform(Geographic, Mercator));
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
                        
                        Ext.Msg.alert('Failed', 'قطعه شما با قطعات دیگر تداخل دارد');
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
                    fillColor: '#A691EF', fillOpacity:.3,
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
                    fillColor: '#A691EF', fillOpacity:.3,
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
        
        var Geographic = new OpenLayers.Projection("EPSG:4326");
        var Mercator = new OpenLayers.Projection("EPSG:900913");
        var map = new OpenLayers.Map('Our map', {
            numZoomLevels:21,
            projection: Mercator,
            displayProjection: Geographic
        });
        
        setMap();
        
        var layer = new OpenLayers.Layer.Vector("همه قطعات زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            }), 
            displayInLayerSwitcher: false
        });
        
        var drawLayer = new OpenLayers.Layer.Vector("از این لایه برای رسم پلی گن ها استفاده می کنیم", {displayInLayerSwitcher: false});
        drawLayer.events.register('featureadded', this, intersectionTestCallBack);
        drawLayer.events.register('beforefeatureadded', this, beforefeatureadded);

        var segmentLayer = new OpenLayers.Layer.Vector("لایه قطعات یک زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                params: userId,
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            }),
            displayInLayerSwitcher: false
        });
        segmentLayer.events.register('loadend', this, loadEnd);
        
        var intersectionLayer = new OpenLayers.Layer.Vector("لایه ی تداخل", {displayInLayerSwitcher: false, projection: Geographic});
        layer.styleMap = st.layerStyleMap();
        segmentLayer.styleMap = st.allSegmentsStyleMap();
        intersectionLayer.styleMap = st.getIntersectionStyleMap();
        
        map.addLayers([layer, drawLayer, segmentLayer, intersectionLayer]);
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
            text: 'افزودن با استفاده از مختصات',
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
                                            var newPoint = new OpenLayers.Geometry.Point(parseFloat(point[0]), parseFloat(point[1]));
                                            geoPoints.push(newPoint.transform(Geographic, Mercator));
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
                                        map.zoomToExtent(drawLayer.getDataExtent());
                                    }
                                }, 
                                this,
                                80,
                                '55.803161797162,28.227430945601 55.804197129842,28.226508265699 55.804701385136,28.227414852346 55.803161797162,28.227430945601'
                );
            }
        });
        var addUTMPolygon = Ext.create('Ext.Button', {
            text: 'UTM افزودن با استفاده از',
            handler: function() {
                Ext.Msg.prompt('افزودن یک قطعه با استفاده از نقاط موجود',
                               'لطفا نقاط خود را مانند مثال درون کادر زیر وارد نمایید<br>"x1,y1 x2,y2 x3,y3, ..." :فرمت ورود اطلاعات', 
                               function(btn, text){
                                    if (btn === 'ok'){
                                        drawLayer.removeAllFeatures();
                                        intersectionLayer.removeAllFeatures();
                                        var geoPoints = [];
                                        var points = text.split(" ");
                                        var i = 0;
                                        while(i<points.length){
                                            var point = points[i].split(",");
                                            var newPoint = new OpenLayers.Geometry.Point(parseFloat(point[0]), parseFloat(point[1]));
                                            geoPoints.push(newPoint);
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
                                        map.zoomToExtent(drawLayer.getDataExtent());
                                    }
                                }, 
                                this,
                                80
                                //'55.803161797162,28.227430945601 55.804197129842,28.226508265699 55.804701385136,28.227414852346 55.803161797162,28.227430945601'
                );
            }
        });
        toolbarItems.push(addPolygon);
        toolbarItems.push(addUTMPolygon);
        var intersectionTestBtn = Ext.create('Ext.Button', {
            text: 'آزمایش تداخل',
            handler: intersectionTestCallBack
        });
        toolbarItems.push(intersectionTestBtn);
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            map: map,
            rtl: false,
            //resizable: true,
            //collapsible: true,
            region: "center",
            width: 400,
            zoom: 5,
            //center: [55,34],
            center: [6122571.992777778,3489123.8364954195],
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
        this.getGeoText = function(){
            
            var geoText;
            if(drawLayer.features.length>0){
                geoText = "MULTIPOLYGON(((";
                var components = drawLayer.features[0].geometry.components[0].components;
                for(var i=0; i<components.length; i++){
                    var a = components[i].clone();
                    var b = a.transform(Mercator, Geographic);
                    geoText += b.x + ' ' + b.y + ',';
                }
                geoText = geoText.slice(0, geoText.length-1);
                geoText += ')))';
            }
            
            console.log("geoText: " + geoText);
            return geoText;
        };
        var getGeoText = this.getGeoText;
    },
    
    landLord: function(win){
        var userId;
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
                userId = parseInt(selectedRecord[0].raw.id);
                win.setUserId(userId);
            }
        });
        
        this.getPanel = function(){
            return gridPanel;
        };
        
        this.getUserId = function(){
            return userId;
        };
    },
    
    window: function(myThis){
        var desktop = myThis.app.getDesktop();
        var me = myThis;
        var win = desktop.getWindow('addSegment-win');
        
        myMapPanel = new me.mapPanel(this);
        myLandLord = new me.landLord(this);
        var fieldFormPanel = new me.getFieldForm(this);
        
        var saveBtn = Ext.create('Ext.Button', {
                text: 'افزودن قطعه زمین',
                handler : function(){
                    if(!fieldFormPanel.formValidation()){
                        Ext.Msg.alert('Failed', 'لطفا در ورود اطلاعات دقت فرمایید');
                        return;
                    }
                    var userId = myLandLord.getUserId();
                    if(userId === undefined){
                        Ext.Msg.alert('خطا', 'لطفا یک مالک را انتخاب کنید.');
                        return;
                    }
                    
                    var geoText = myMapPanel.getGeoText();
                    if(geoText === undefined){
                        Ext.Msg.alert('خطا', 'لطفا یک قطعه به نقشه اضافه نمایید.');
                        return;
                    }
                    fieldFormPanel.getPanel().getForm().submit({
                        url: 'index.php?r=land/create',
                        params: {geoText: geoText, userId: userId},
                        submitEmptyText: false,
                        waitMsg: 'درد حال ذخیره اطلاعات ...',
                        success: function(form, action) {
                            Ext.Msg.alert('نتیجه', 'قطعه شما با موفقیت ذخیره شد.');
                        },
                        failure: function(form, action) {
                            f = form;
                            a = action;
                            //Ext.Msg.alert('Failed', action.response.responseText);
                        }
                    });
                }
            });
        
        this.setPanelVisible = function(mapPanelVisible, polygonPanelVisible, fieldFormPanelVisible){
            myMapPanel.setVisible(mapPanelVisible);
            myLandLord.setVisible(polygonPanelVisible);
            fieldFormPanel.setVisible(fieldFormPanelVisible);
        };

        if(!win){
            var panel = Ext.create('Ext.Panel', {
                layout: 'border',
                items: [myMapPanel.getPanel(), myLandLord.getPanel(), fieldFormPanel.getPanel()]
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
                items: [panel],
                bbar: [saveBtn]
            });
        }
        
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