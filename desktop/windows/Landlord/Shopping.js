/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Shopping', {
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
    id:'shopping-win',

    init : function(){
        this.launcher = {
            text: 'خرید زمین',
            iconCls:'shopLand-16x16'
        };
    },
    
    AllData : function(){
        var plateCode = {plateCode: ''};
        var layer = new OpenLayers.Layer.Vector("لایه استان", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed(), new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=business/saleList",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        
        var store = Ext.create('GeoExt.data.FeatureStore', {
            layer: layer,
            pageSize: 10,
            fields: [
                {name: 'id', type: 'int'},
                {name: 'sellerFirstName', type: 'string'},
                {name: 'sellerLastName',  type: 'string'},
                {name: 'buyerFirstName', type: 'string'},
                {name: 'buyerLastName',  type: 'string'},
                {name: 'suggestPrice', type: 'string'},
                {name: 'finalPrice',  type: 'string'},
                {name: 'state',  type: 'string'},
                {name: 'suggestDate', type: 'string'},
                {name: 'buyDate', type: 'string'},
                {name: 'description',  type: 'string'}
            ],
            autoLoad: true
        });
        
        var pagingToolbar = Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: 'نمایش رکورد {0} تا {1} از {2} رکورد',
            emptyMsg: "داده ای یافت نشد."
        });
        var filterBar = Ext.create('Ext.ux.grid.FilterBar',{renderHidden: false, showShowHideButton: true,showClearAllButton: true});
        var gridPanel = Ext.create('Ext.grid.Panel', {
            store: store,
            rtl: true,
            plugins: [filterBar],
            border: false,
            cls: 'landLordGrid',
            region: 'center',
            selType: 'featuremodel',
            columns: {
                plugins: [{
                        ptype: 'gridautoresizer'
                }],
                items: [
                    {xtype: 'rownumberer',width: 30,sorareatable: false},
                    { text: 'نام فروشنده',  dataIndex: 'sellerFirstName', width: 60, align: 'center',height: 30, filter: true },
                    { text: 'فامیل فروشنده',  dataIndex: 'sellerLastName', width: 60, align: 'center',height: 30, filter: true },
                    { text: 'نام خریدار',  dataIndex: 'buyerFirstName', width: 60, align: 'center',height: 30, filter: true },
                    { text: 'فامیل خریدار',  dataIndex: 'buyerLastName', width: 60, align: 'center',height: 30, filter: true },
                    { text: 'قیمت پیشنهادی',  dataIndex: 'suggestPrice', width: 60, align: 'center',height: 30, filter: {type: 'int'}},
                    { text: 'قیمت نهایی',  dataIndex: 'finalPrice', width: 60, align: 'center',height: 30, filter: {type: 'int'} },
                    { text: 'وضعیت', dataIndex: 'state', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: true },
                    { text: 'تاریخ پیشنهاد', dataIndex: 'suggestDate', width: 150, field: {xtype: 'textfield'}, align: 'center', filter: {type: 'date'} },
                    { text: 'تاریخ خرید', dataIndex: 'buyDate', width: 220, field: {xtype: 'textfield'}, align: 'center', filter: {type: 'date'} },
                    { text: 'توضیحات', dataIndex: 'description', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true }
                ]},
            viewConfig: {
                stripeRows: true
            },
            bbar: [pagingToolbar,'->', {
                text: 'خرید قطعه زمین',
                iconCls: 'landLord-add',
                handler : function() {pricePanel.setVisible(true);}
            }]
        });
        gridPanel.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length)
                plateCode.plateCode = selectedRecord[0].raw.data.landShopID;
        });
        
        var required = '<span style="color:red;font-weight:bold" data-qtip="این فیلد ضروری می باشد">*</span>';
        
        var linkCodeField = Ext.create('Ext.form.TextField', {
            width: 150,
            margins: '0 0 0 5',
            name: 'linkCode',
            fieldLabel: 'لینک کد',
            allowBlank: false,
            afterLabelTextTpl: required
        });
        var suggestPriceField = Ext.create('Ext.form.TextField', {
            width: 200,
            margins: '0 0 0 5',
            name: 'suggestPrice',
            fieldLabel: 'قیمت پیشنهادی(به ریال)',
            allowBlank: false,
            afterLabelTextTpl: required
        });
        var description = Ext.create('Ext.form.field.TextArea', {
            width: 400,
            flex: 1,
            name: 'description',
            fieldLabel: 'توضیحات'
        });
        var pricePanel= Ext.widget('form', {
                items: [{
                    xtype: 'fieldcontainer',
                    buttonAlign: 'center',
                    layout: 'hbox',
                    bodyStyle: {direction: 'rtl', alignment: 'right'},
                    fieldDefaults: {
                        labelAlign: 'top'
                    }, 
                    items: [description, suggestPriceField, linkCodeField]
                }],
                region: "south",
                collapsible: true,
                collapseMode: 'mini',
                title: "افزودن به لیست خرید",
                layout: {type: 'vbox', align: 'stretch', pack: 'center'},
                bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
                border: false,
                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 250,
                    labelStyle: 'font-weight:bold'
                },
                bodyPadding: 4,
                buttons: [{
                    text: 'بی خیال',
                    handler: function(){pricePanel.setVisible(false);}
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
        
        /////////////////////////////////////////////////////////////////////////////////
        var map = new OpenLayers.Map('Our map', {numZoomLevels:21});

        var open_streetMap_wms = new OpenLayers.Layer.WMS(
            "OpenStreetMap WMS",
            "http://ows.terrestris.de/osm/service?",
            {layers: 'OSM-WMS'},{
                attribution: 'Morteza Malvandi'
            }
        );
        
        map.addLayers([open_streetMap_wms, layer]);
        
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            title: 'سلام بر مهدی',
            map: map,
            rtl: false,
            collapsible: true,
            region: "west",
            width: 300,
            zoom: 5,
            center: [55,32.2]
        });
        // ------------ Tree Panel ------------
        // ------------------------------------
        
        this.panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [gridPanel, mapPanel, pricePanel]
        });
    },

    createWindow : function(){
        console.log("in the name of Allah");
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('shopping-win');
        if(!win){
            var allDataGridPanel = new me.AllData();
            win = desktop.createWindow({
                id: 'shopping-win',
                title:'خرید زمین',
                width:1300,
                rtl: true,
                height:300,
                iconCls: 'shopLand-16x16',
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

