/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Search', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.view.View',
        'Ext.ux.DataView.DragSelector',
        'Ext.ux.DataView.LabelEditor',
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
    id:'search-win',

    init : function(){
        this.launcher = {
            text: 'جستجو',
            iconCls:'icon-grid'
        };
    },
    
    landLord: function(region, land){
        getCheckBox = function(name, boxLabel, checked){
            var that = Ext.create('Ext.form.field.Checkbox', {
                name: name,
                boxLabel: boxLabel,
                checked: checked, 
                listeners: {
                    click: {
                        element: 'el', //bind to the underlying el property on the panel
                        fn: function(){ 
                            landLordStore.proxy.extraParams[name] = that.checked;
                            landLordStore.reload();
                        }
                    }
                }
            });
            
            return that;
        };
        var hasEsteshhad = getCheckBox('hasEsteshhad', 'استشهادنامه', true);
        var hasMap = getCheckBox('hasMap', 'نقشه', true);
        var hasEstelam = getCheckBox('hasEstelam', 'استعلام', true);
        var hasMadarek = getCheckBox('hasMadarek', 'مدارک', true);
        var hasSanad = getCheckBox('hasSanad', 'سند', true);
        var hasTayeediyeShura = getCheckBox('hasTayeediyeShura', 'تاییدیه شورا', true);
        var hasQabz = getCheckBox('hasQabz', 'قبض', true);
        
        //myparams = getParams();
        var landLordModel = Ext.define('LandLordModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'sheetNo',  type: 'string'},
                {name: 'waterType',  type: 'string'},
                {name: 'plantType',  type: 'string'},
                {name: 'position',  type: 'string'},
                {name: 'usingType',  type: 'string'},
                {name: 'numAdjacent',  type: 'string'},
                {name: 'villageName',  type: 'string'},
                {name: 'area', type: 'string'},
                {name: 'perimeter',  type: 'string'},
                {name: 'finalPrice',       type: 'string'},
                {name: 'pricePerMeter',  type: 'string'},
                {name: 'mobayeNo',  type: 'string'},
                {name: 'mobayeDate',  type: 'string'},
                {name: 'committeeNo',  type: 'string'},
                {name: 'committeeDate',  type: 'string'},
                
            ]
        });
        landLordStore = Ext.create('Ext.data.Store', {
            model: 'LandLordModel',
            pageSize: 15,
            proxy: {
                type: 'ajax',
                url: 'index.php?r=land/search',
                reader: {
                    type: 'json',
                    root: 'landDetail',
                    totalProperty: 'totalCount'
                },
                extraParams: {
                    hasEsteshhad: hasEsteshhad.checked,
                    hasMap: hasMap.checked,
                    hasEstelam: hasEstelam.checked,
                    hasMadarek: hasMadarek.checked,
                    hasSanad: hasSanad.checked,
                    hasTayeediyeShura: hasTayeediyeShura.checked,
                    hasQabz: hasQabz.checked
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
                    }
                },
                edit: function(e, ee, eee){
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
                    { text: 'ردیف',xtype: 'rownumberer', width: 40, align: 'center',height: 20 },
                    { text: 'شماره شیت', dataIndex: 'sheetNo', width: 80, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نوع آبیاری', dataIndex: 'waterType', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نوع کشت', dataIndex: 'plantType', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'موقعیت', dataIndex: 'position', width: 220, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'نوع کاربری', dataIndex: 'usingType', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'تعداد مجاورت', dataIndex: 'numAdjacent', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'روستا', dataIndex: 'villageName', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'مساحت', dataIndex: 'area', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true }
                ]},
            viewConfig: {
                stripeRows: true
            },
            bbar: [pagingToolbar],
            tbar: [hasEsteshhad, hasMap, hasEstelam, hasMadarek, hasSanad, hasTayeediyeShura, hasQabz]
        });
        
        gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
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
    },
    images: function(region){
        var ImageModel = Ext.define('ImageModel', {
            extend: 'Ext.data.Model',
            fields: [
               {name: 'name'},
               {name: 'url'},
               {name: 'size', type: 'float'},
               {name:'lastmod', type:'date', dateFormat:'timestamp'}
            ]
        });

        var store = Ext.create('Ext.data.Store', {
            model: 'ImageModel',
            proxy: {
                type: 'ajax',
                url: 'get-images.php',
                reader: {
                    type: 'json',
                    root: 'images'
                }
            }
        });
        store.load();

        var panel =  Ext.create('Ext.Panel', {
            id: 'images-view',
            frame: true,
            collapsible: true,
            width: 535,
            renderTo: 'dataview-example',
            title: 'Simple DataView (0 items selected)',
            items: Ext.create('Ext.view.View', {
                store: store,
                tpl: [
                    '<tpl for=".">',
                        '<div class="thumb-wrap" id="{name}">',
                        '<div class="thumb"><img src="{url}" title="{name}"></div>',
                        '<span class="x-editable">{shortName}</span></div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'
                ],
                multiSelect: true,
                height: 310,
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: 'No images to display',
                plugins: [
                    Ext.create('Ext.ux.DataView.DragSelector', {}),
                    Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
                ],
                prepareData: function(data) {
                    Ext.apply(data, {
                        shortName: Ext.util.Format.ellipsis(data.name, 15),
                        sizeString: Ext.util.Format.fileSize(data.size),
                        dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                    });
                    return data;
                },
                listeners: {
                    selectionchange: function(dv, nodes ){
                        var l = nodes.length,
                            s = l !== 1 ? 's' : '';
                        this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
                    }
                }
            })
        });
        
        this.getPanel = function(){
            return panel;
        };
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
        };
        this.setVisible = function(flag){
            panel.setVisible(flag);
        };
        this.getPanel = function(){
            return panel;
        };
    },
    
    allData: function(rootThis){
        /////////////////////////////////////////////////////////////////////////////////
        
        var land = new rootThis.land("south", this);
        var landLord = new rootThis.landLord("center", land);
        var map = new rootThis.map("west");
        var imagePanel = new rootThis.images('south');
        //map.addLayer2Map(land.getLayer());
        
        this.setVisible = function(landLordVisible, landVisible, mapVisible, shoppingVisible, uploadVisible){
            landLord.setVisible(landLordVisible);
            land.setVisible(landVisible);
            map.setVisible(mapVisible);
        };
        this.panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [ landLord.getPanel(), map.getPanel(), imagePanel.getPanel()]
        });
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('search-win');
        if(!win){
            var allDataGridPanel = new me.allData(me);
            var addToShopBtn = Ext.create('Ext.Button', {
                text: 'ثبت خرید جدید',
                iconCls: 'landLord-add',
                handler : function(){
                    allDataGridPanel.setVisible(false, false, false, true, false);
                    addToShopBtn.setVisible(false);
                }
            });
            win = desktop.createWindow({
                id: 'search-win',
                title:'ثبت خرید',
                width:1300,
                rtl: true,
                height:400,
                iconCls: 'icon-grid',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                items: [allDataGridPanel.panel],
                bbar: [addToShopBtn]
            });
        }
        return win;
    }
});
