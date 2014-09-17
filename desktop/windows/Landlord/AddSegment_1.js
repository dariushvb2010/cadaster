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
        
        var userID = {userId: 0};
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
        var filterBar = Ext.create('Ext.ux.grid.FilterBar',{renderHidden: false});
        var gridPanel = Ext.create('Ext.grid.Panel', {
            store: landLordStore,
            title: 'لطفا نام مالک را انتخاب کنید',
            titleAlign: 'right',
            bodyStyle: {direction: 'ltr'},
            plugins: [filterBar],
            //width: 540,
            //height: 200,
            border: false,
            cls: 'landLordGrid',
            region: 'center',
            columns: {
                plugins: [{
                        ptype: 'gridautoresizer'
                }],
                items: [
                    { text: 'نام پدر', dataIndex: 'DadName', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نام خانوادگی', dataIndex: 'LastName', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نام', dataIndex: 'FirstName', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'ردیف',xtype: 'rownumberer', width: 40, align: 'center',height: 20 },
                ]},
            viewConfig: {
                stripeRows: true
            },
            bbar: [pagingToolbar]
        });
        gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                userID.userId = parseInt(selectedRecord[0].raw.id);
            }
        });
        
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
        
        var filterPanel = Ext.create('Ext.panel.Panel', {
            bodyPadding: 5,  // Don't want content to crunch against the borders
            region: 'west',
            title: 'ویژگیهای قطعه زمین',
            titleAlign: 'right',
            items: [usingType, numAdjacent, position, plantType, waterType]
        });
        
        var form = Ext.create('Ext.form.Panel', {
            //width: 200,
            region: 'center',
            items: [gridPanel, filterPanel],
            layout: {
                type: 'hbox',       // Arrange child items vertically
                align: 'stretch',    // Each takes up full width
                padding: 5
            },
            //title: 'افزودن با استفاده از نقاط',
            bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
            buttons: [{
                text: 'تغییر',
                disabled: true,
                formBind: true,
                handler: function(){
                    userID.geoText = win.getGeoText();
                    this.up('form').getForm().submit({
                        url: 'index.php?r=land/create',
                        params: userID,
                        submitEmptyText: false,
                        //geoText
                        waitMsg: 'در حال ارسال داده ها ...',
                        success: function(form, action) {
                           Ext.MessageBox.alert('Status', 'قطعه زمین مورد نظر با موفقیت ثبت شد.', function(){win.closeWin();});
                        },
                        failure: function(form, action) {
                            Ext.MessageBox.alert('Status', 'متاسفانه مشکلی در ثبت قطعه زمین رخ داده است.');
                        }
                    });
                }
            },{
                text: 'بی خیال',
                handler: function(){win.close();}
            }]
        }).setVisible(false);
        
        this.setVisible = function(flag){
            form.setVisible(flag);
        };
        
        return form;
    },
    
    mapPanel: function(win){
        var layer = new OpenLayers.Layer.Vector("لایه استان", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        
        var map = new OpenLayers.Map('Our map');

        var open_streetMap_wms = new OpenLayers.Layer.WMS(
            "OpenStreetMap WMS",
            "http://ows.terrestris.de/osm/service?",
            {layers: 'OSM-WMS'}
        );
        var drawVector = new OpenLayers.Layer.Vector("لایه ای که میخواهیم با استفاده از آن یک پلی گن رسم کنیم.");
        
        map.addLayers([open_streetMap_wms, layer, drawVector]);
        
        var toolbarItems = [];
        
        var doneHandler = function (e){
            var geoText = "MULTIPOLYGON(((";
            for(var i=0; i<e.components[0].components.length; i++){
                geoText +=  e.components[0].components[i].x + ' ' + e.components[0].components[i].y + ',' ;
            }
            geoText = geoText.slice(0, geoText.length-1);
            geoText += ')))';
            win.setGeoText(geoText);
            
            Ext.Ajax.request({
                url: '?r=land/Intersection',
                params: {
                    geoText: geoText
                },
                success: function(response){
                    text = response.responseText;
                    text = eval('(' + text + ')');
                    if(text.features.length<1){
                        win.setPanelVisible(false, false, true);
                        //panel.setVisible(false);
                        //win.setFieldFormPanelVisible(true);
                    }else
                        alert("قطعه شما با قطعات دیگر تداخل دارد.");
                }
            });
        };
        
        var drawOptions = {
            callbacks: {
                "done": doneHandler
            }
        };
        
        var action = Ext.create('GeoExt.Action', {
            text: "رسم پلی گن",
            control: new OpenLayers.Control.DrawFeature(drawVector, OpenLayers.Handler.Polygon, drawOptions),
            map: map,
            toggleGroup: "draw",
            allowDepress: false,
            tooltip: "draw line",
            group: "draw"
        });
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        var panel = Ext.create('GeoExt.panel.Map', {
            title: 'افزودن با استفاده از نقشه',
            map: map,
            rtl: false,
            collapsible: true,
            region: "west",
            //height: 550,
            width: 300,
            zoom: 5,
            center: [55,32.2],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: toolbarItems
            }]
        }).setVisible(true);
        
        this.setVisible = function(flag){
            panel.setVisible(flag);
        };
        this.getPanel = function(){
            return panel;
        };
    },
    
    PolygonFieldForm: function(win){
        
        var required = '<span style="color:red;font-weight:bold" data-qtip="این فیلد ضروری می باشد">*</span>';
        
        var polygonTextArea = Ext.create('Ext.form.field.TextArea', {
            rows: 20,
            cols: 50,
            name: 'geoText',
            fieldLabel: 'مختصات polygon',
            allowBlank: false,
            value: 'MULTIPOLYGON(((30.232520055 40.36352647,31.83 41.84,32.318623035 40.13173294,33.232520055 33.36352647, 30.232520055 40.36352647)))',
            afterLabelTextTpl: required
        });

        var panel = Ext.create('Ext.form.Panel', {
            width: 500,
            region: 'east',
            items: [polygonTextArea],
            //collapsible: true,
            title: 'افزودن با استفاده از نقاط',
            bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
            buttons: [{
                text: 'تغییر',
                disabled: true,
                formBind: true,
                handler: function(){
                    var geoText = polygonTextArea.getValue();
                    win.setGeoText(geoText);
                    Ext.Ajax.request({
                        url: '?r=land/Intersection',
                        params: {
                            geoText: geoText
                        },
                        success: function(response){
                            var text = response.responseText;
                            form.setVisible(false);
                            win.setFieldFormPanelVisible(true);
                        },
                        failure: function(response){
                            console.log('infortuanetly has an error');
                        }
                    });
                }
            },{
                text: 'بی خیال',
                handler: function(){win.close();}
            }]
        }).setVisible(true);
        
        this.setVisible = function(flag){
            panel.setVisible(flag);
        };
        this.getPanel = function(){
            return panel;
        };
    },
    
    window: function(myThis){
        
        var geoText = '';
        
        var desktop = myThis.app.getDesktop();
        var me = myThis;
        var win = desktop.getWindow('addSegment-win');
        
        var myMapPanel = new me.mapPanel(this);
        var myPolygonPanel = new me.PolygonFieldForm(this);
        var fieldFormPanel = new me.getFieldForm(this);
        
        this.setPanelVisible = function(mapPanelVisible, polygonPanelVisible, fieldFormPanelVisible){
            myMapPanel.setVisible(mapPanelVisible);
            myPolygonPanel.setVisible(polygonPanelVisible);
            fieldFormPanel.setVisible(fieldFormPanelVisible);
        };

        if(!win){

            var panel = Ext.create('Ext.Panel', {
                layout: 'border',
                items: [myMapPanel.getPanel(), myPolygonPanel.getPanel(), fieldFormPanel]
            });
            win = desktop.createWindow({
                id: 'addSegment-win',
                title:'افزودن قطعه زمین',
                width:900,
                rtl: true,
                height:200,
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
    },
    
    
    createWindow: function(){
        
        window1 = new this.window(this);
        
        return window1.getWin();
    }
});

