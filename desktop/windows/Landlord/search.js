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
        'Ext.util.*',
        'Ext.util.*',
        'Ext.form.*'

    ],
    id: 'search-win',
    init: function () {
        this.launcher = {
            text: 'گزارشگیری',
            iconCls: 'report-16x16'
        };
    },
    
    allData: function (rootThis) {
        var loadEnd = function(e){
            me = e;
            if(e.response.features === null || e.response.features.length<1) return;
            map.zoomToExtent(segmentLayer.getDataExtent());
        };
        
        var Geographic = new OpenLayers.Projection("EPSG:4326");
        var Mercator = new OpenLayers.Projection("EPSG:900913");
        var map = new OpenLayers.Map('Our map', {
            numZoomLevels:21,
            projection: Mercator,
            displayProjection: Geographic
        });
        var segmentLayer = new OpenLayers.Layer.Vector("یک قطعه زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                readWithPOST: true,
                url: "index.php?r=land/getLand",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        segmentLayer.events.register('loadend', this, loadEnd);
        map.addLayer(segmentLayer);
        var layer = new OpenLayers.Layer.Vector("همه زمین ها", {
                    projection: new OpenLayers.Projection("EPSG:4326"),
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        readWithPOST: true,
                        url: "index.php?r=land/features",
                        format: new OpenLayers.Format.GeoJSON({})
                    })
                });
        var landLord =  function (region, imagePanel) {
			var gid;
			this.refreshLandlordWithGid = function(_gid){
				console.log("Salam Bar Mahdi");
				gid = _gid;
				landLordStore.proxy.extraParams['gid'] = gid;
				landLordStore.reload();
				getTotalNumbers();
				/*landLordStore.load({
					params: {
						gid: gid,
					},
					scope: this
				});*/
			};
            var getTotalNumbers = function(){
                var params = {
					gid: gid,
                    hasEsteshhad: hasEsteshhad.checked,
                    hasMap: hasMap.checked,
                    hasEstelam: hasEstelam.checked,
                    hasMadarek: hasMadarek.checked,
                    hasSanad: hasSanad.checked,
                    hasTayeediyeShura: hasTayeediyeShura.checked,
                    hasQabz: hasQabz.checked,
                    hasShop: hasShop.checked
                };
                Ext.Ajax.request({
                    url: 'index.php?r=land/getTotalNumbers',
                    params: params,
                    success: function (response) {
                        var text = eval('('+ response.responseText + ')');
                        sumAreaDis.setValue(text.area);
                        sumPerimeterDis.setValue(text.perimeter);
                        sumPriceDis.setValue(text.price);
                    }
                });
            };
            
            var getCheckBox = function (name, boxLabel, checked) {
                var that = Ext.create('Ext.form.field.Checkbox', {
                    name: name,
                    boxLabel: boxLabel,
                    checked: checked,
                    listeners: {
                        click: {
                            element: 'el', //bind to the underlying el property on the panel
                            fn: function () {
								gid = "";
                                landLordStore.proxy.extraParams[name] = that.checked;
                                landLordStore.reload();
                                getTotalNumbers();
                            }
                        }
                    }
                });

                return that;
            };
            
            var hasEsteshhad = getCheckBox('hasEsteshhad', 'استشهادنامه', true);
            var hasMap = getCheckBox('hasMap', 'نقشه', false);
            var hasEstelam = getCheckBox('hasEstelam', 'استعلام', false);
            var hasMadarek = getCheckBox('hasMadarek', 'مدارک', false);
            var hasSanad = getCheckBox('hasSanad', 'سند', false);
            var hasTayeediyeShura = getCheckBox('hasTayeediyeShura', 'تاییدیه شورا', false);
            var hasQabz = getCheckBox('hasQabz', 'قبض', false);
            var hasShop = getCheckBox('hasShop', 'ثبت شده', true);

            var userSelectedGid;

            var deleteShopBtn = Ext.create('Ext.Button', {
                text: 'حذف خرید',
                iconCls: 'delete-shop-Btn',
                handler: function () {
                    if (userSelectedGid == undefined) {
                        Ext.Msg.alert('Failed', 'لطفا یک قطعه زمین را انتخاب کنید');
                        return;
                    }
                    Ext.Ajax.request({
                        url: 'index.php?r=business/delete',
                        params: {
                            gid: userSelectedGid,
                        },
                        success: function (response) {
                            landLordStore.reload()
                        },
                        failure: function (response) {
                            //text = eval('('+ response + ')');
                            text = response;
                            Ext.Msg.alert('Failed', text.responseText);

                        }
                    });
                }
            });

            var reportBtn = Ext.create('Ext.Button', {
                text: 'ذخیره اکسل',
                iconCls: 'excel-16x16',
                handler: function () {
                    var filterArray;
                    if(filterBar.filterArray.length>0){
                        filterArray = '[';
                        for(var i=0; i<filterBar.filterArray.length; i++){
                            filterArray += '{';
                            filterArray += '"property": "' + filterBar.filterArray[i].property + '",';
                            filterArray += '"value": "' + filterBar.filterArray[i].value + '",';
                            filterArray += '"type": "' + filterBar.filterArray[i].type + '",';
                            filterArray += '"operator": "' + filterBar.filterArray[i].operator + '"';
                            filterArray += '},';
                        };
                        filterArray = filterArray.slice(0, filterArray.length-1);
                        filterArray += ']';
                    }
                    var createParams = 'hasEsteshhad='+hasEsteshhad.checked + '&' +
                                        'hasMap=' + hasMap.checked + '&' +
                                        'hasEstelam=' + hasEstelam.checked + '&' +
                                        'hasMadarek=' + hasMadarek.checked + '&' +
                                        'hasSanad=' + hasSanad.checked + '&' +
                                        'hasTayeediyeShura=' + hasTayeediyeShura.checked + '&' +
                                        'hasQabz=' + hasQabz.checked + '&' +
                                        'hasShop=' + hasShop.checked;
                    if(filterArray !== undefined){
                        createParams += '&filter=' + filterArray;
                    }
                    window.open('index.php?r=land/createExcel&'+createParams, '_blank');
                }
            });
            
            var getDisplay = function(label, value, width, labelWidth){
                return new Ext.create('Ext.form.field.Display', {
                    fieldLabel: label,
                    //value: value, 
                    labelWidth: labelWidth,
                    width: width
                });
            };
            var sumAreaDis = getDisplay("مساحت کل", 123, 120, 63);
            var sumPerimeterDis =  getDisplay("محیط کل", 123, 110, 50);
            var sumPriceDis = getDisplay("قیمت کل", 123, 120, 50);
            
            
            var landLordModel = Ext.define('LandLordModel', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'name', type: 'string'},
                    {name: 'family', type: 'string'},
                    {name: 'sheetNo', type: 'string'},
                    {name: 'waterType', type: 'string'},
                    {name: 'plantType', type: 'string'},
                    {name: 'position', type: 'string'},
                    {name: 'usingType', type: 'string'},
                    {name: 'numAdjacent', type: 'string'},
                    {name: 'villageName', type: 'string'},
                    {name: 'area', type: 'float'},
                    {name: 'perimeter', type: 'float'},
                    {name: 'finalPrice', type: 'float'},
                    {name: 'pricePerMeter', type: 'float'},
                    {name: 'mobayeNo', type: 'string'},
                    {name: 'mobayeDate', type: 'string'},
                    {name: 'committeeNo', type: 'string'},
                    {name: 'committeeDate', type: 'string'}
                ]
            });
            var landLordStore = Ext.create('GeoExt.data.FeatureStore', {
                //layer: layer,
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
						gid: "",
                        hasEsteshhad: hasEsteshhad.checked,
                        hasMap: hasMap.checked,
                        hasEstelam: hasEstelam.checked,
                        hasMadarek: hasMadarek.checked,
                        hasSanad: hasSanad.checked,
                        hasTayeediyeShura: hasTayeediyeShura.checked,
                        hasQabz: hasQabz.checked,
                        hasShop: hasShop.checked
                    }
                },
                filterParam: 'query',
                encodeFilters: function (filters) {
                    return filters[0].value;
                },
                remoteFilter: true,
                autoLoad: true
            });
            var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                listeners: {
                    cancelEdit: function (rowEditing, context) {
                        if (context.record.phantom) {
                        }
                    },
                    edit: function (e, ee, eee) {
                        var params = ee.newValues;
                        params.gid = ee.record.raw.gid;
                        Ext.Ajax.request({
                            url: 'index.php?r=land/update',
                            params: params,
                            success: function (response) {
                                text = response;
                            }
                        });

                    }
                }
            });
            var pagingToolbar = Ext.create('Ext.PagingToolbar', {
                store: landLordStore,
                displayInfo: true,
                //displayMsg: 'نمایش رکورد {0} تا {1} از {2} رکورد',
                displayMsg: 'رکورد {0} تا {1} از {2} رکورد',
                emptyMsg: "داده ای یافت نشد.",
            });
            var filterBar = Ext.create('Ext.ux.grid.FilterBar', {renderHidden: false});
            var gridPanel = Ext.create('Ext.grid.Panel', {
                store: landLordStore,
                rtl: true,
                //selType: 'featuremodel',
                plugins: [filterBar, rowEditing, {ptype: 'gridautoresizer'}],
                border: false,
                cls: 'landLordGrid',
                split: true,
                region: region,
                columns: {
                    plugins: [{
                            ptype: 'gridautoresizer'
                        }],
                    items: [
                        {text: 'ردیف', xtype: 'rownumberer', width: 45, align: 'center', height: 20, sortable: false},
                        {text: 'نام', dataIndex: 'name', flex: 1, align: 'center', filter: true, sortable: false, hideable: false},
                        {text: 'نام خانوادگی', dataIndex: 'family', flex: 1, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'شماره شیت', dataIndex: 'sheetNo', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'نوع آبیاری', dataIndex: 'waterType', width: 70, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'نوع کشت', dataIndex: 'plantType', width: 70, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'موقعیت', dataIndex: 'position', width: 70, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'نوع کاربری', dataIndex: 'usingType', width: 100, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'تعداد مجاورت', dataIndex: 'numAdjacent', width: 75, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'روستا', dataIndex: 'villageName', flex: 1, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'مساحت', dataIndex: 'area', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'محیط', dataIndex: 'perimeter', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'قیمت کل', dataIndex: 'finalPrice', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'قیمت هر متر', dataIndex: 'pricePerMeter', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'شماره مبایعه نامه', dataIndex: 'mobayeNo', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true},
                        {text: 'تاریخ مبایعه نامه', dataIndex: 'mobayeDate', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: {type: 'date'}, sortable: false, menuDisabled: true},
                        {text: 'شماره کمیته', dataIndex: 'committeeNo', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: true, sortable: false, menuDisabled: true, hidden: true},
                        {text: 'تاریخ کمیته', dataIndex: 'committeeDate', flex: 1, field: {xtype: 'textfield'}, align: 'center', filter: {type: 'date'}, sortable: false, menuDisabled: true, hidden: true}

                    ]},
                viewConfig: {
                    stripeRows: true
                },
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    style: {
                        direction: 'rtl'
                    },
                    items: [pagingToolbar, '->', sumPriceDis, sumPerimeterDis, sumAreaDis,  reportBtn, deleteShopBtn]
                }],
                //bbar: [pagingToolbar, '->',sumAreaDis, reportBtn, deleteShopBtn],
                tbar: [hasShop,  '->', '', '', '', '', hasEsteshhad, '', '', '', '', hasMap, '', '', '', '', hasEstelam, '', '', '', '', hasMadarek, '', '', '', '', hasSanad, '', '', '', '', hasTayeediyeShura, '', '', '', '', hasQabz]
            });

            gridPanel.getSelectionModel().on('selectionchange', function (sm, selectedRecord) {
                if (selectedRecord.length) {
                    
                    userSelectedGid = selectedRecord[0].raw.gid;
                    loadSegmentWithGid(userSelectedGid);
                    imagePanel.loadStore(selectedRecord[0].raw.gid);
                }
            });
            
            getTotalNumbers();
            this.setVisible = function (flag) {
                gridPanel.setVisible(flag)
            };
            this.getPanel = function () {
                return gridPanel;
            };
        };
        var images = function (region) {
            var gid = {gid: ''};
            var ImageModel = Ext.define('ImageModel', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'name'},
                    {name: 'url'},
                    {name: 'size', type: 'float'},
                    {name: 'lastmod', type: 'date', dateFormat: 'timestamp'}
                ]
            });

            var store = Ext.create('Ext.data.Store', {
                model: 'ImageModel',
                proxy: {
                    type: 'ajax',
                    url: 'index.php?r=business/imginfo',
                    extraParams: gid,
                    reader: {
                        type: 'json',
                        root: 'images'
                    }
                }
            });
            //store.load();
            this.loadStore = function (gid) {
                store.load({
                    params: {
                        gid: gid
                    },
                    callback: function (records, operation, success) {
                        r = records;
                        o = operation;
                        s = success;
                        console.log("In the name of Allah - help me ya Allah");
                        // do something after the load finishes
                    },
                    scope: this
                });
            };
            this.ali = function (elem) {
                var imagesContainer = elem.parentNode;
                numImages = imagesContainer.childNodes.length - 1;
                var selectedImageIndex = undefined;
                for (var i = 0; i < numImages; i++) {
                    var main = imagesContainer.childNodes[i];
                    baseImgNode = main.childNodes[0].childNodes[0].childNodes[0];
                    if (baseImgNode.src == elem.childNodes[0].childNodes[0].childNodes[0].src) {
                        selectedImageIndex = i;
                    }
                }

                console.log(imagesContainer.childNodes.length);
                var backDiv = document.createElement('div');
                backDiv.setAttribute('id', 'image-on-top');
                backDiv.setAttribute('style', 'position:absolute; width:100%; height:100%; top:0px; left:0px; z-index:10000000; background-color:rgba(0,0,0,0.6)');
                var mainDiv = document.createElement('div');
                mainDiv.setAttribute('style', 'margin:20px 20px; text-align:center');
                backDiv.appendChild(mainDiv);

                var controlDiv = document.createElement('div');
                controlDiv.setAttribute('id', 'controlDiv');
    //            controlDiv.setAttribute('style','background-color:gray;');
                mainDiv.appendChild(controlDiv);

                var close = document.createElement('span');
                close.setAttribute('id','close-slide-show');
                close.setAttribute('onclick', "document.getElementById('image-on-top').parentNode.removeChild(document.getElementById('image-on-top'))");
                close.setAttribute('style', ' background-size: 100%;display:inline-block;width:30px;height:30px;margin-left:30px;cursor:pointer;');

    //            var zarb = document.createTextNode('x');
    ////            close.setAttribute('style','');
    //            close.appendChild(zarb);
                controlDiv.appendChild(close);

                var left = document.createElement('span');
                left.setAttribute('id', 'left-arrow');
                left.setAttribute('style', '');
                left.setAttribute('onclick', 'that.changeImage(' + (selectedImageIndex - 1) + ')');
                //left.appendChild(document.createTextNode('<'));
                controlDiv.appendChild(left);
                var right = document.createElement('span');
                right.setAttribute('id', 'right-arrow');
                right.setAttribute('style', '');
                right.setAttribute('onclick', 'that.changeImage(' + (selectedImageIndex + 1) + ')');
                //right.appendChild(document.createTextNode('>'));
                controlDiv.appendChild(right);


                var img = document.createElement('img');
                img.setAttribute('id', 'temp-image-show');
                img.setAttribute('style','max-width:80%; max-height:70%');
                img.src = elem.childNodes[0].childNodes[0].childNodes[0].src;
                mainDiv.appendChild(img);
                document.getElementById('ext-gen1001').appendChild(backDiv);
            };
            this.changeImage = function (index) {

                var imagesContainer = document.getElementById('dataview-1052');
                numImages = imagesContainer.childNodes.length - 1;
                if (index >= numImages || index < 0) {
                    return;
                }
                if (index > 0) {
                    document.getElementById('left-arrow').setAttribute('onclick', 'that.changeImage(' + (index - 1) + ')');
                }
                if(index<numImages-1){
                    document.getElementById('right-arrow').setAttribute('onclick', 'that.changeImage(' + (index + 1) + ')');
                }
                var main = imagesContainer.childNodes[index];
                var baseImgNode = main.childNodes[0].childNodes[0].childNodes[0];
                document.getElementById('temp-image-show').src = baseImgNode.src;

            };
            that = this;
            var panel = Ext.create('Ext.Panel', {
                id: 'images-view',
                region: region,
                frame: true,
                collapsible: true,
                //width: 535,
                //renderTo: 'dataview-example',
                title: 'نمایش مدارک موجود ',
                items: Ext.create('Ext.view.View', {
                    store: store,
                    tpl: [
                        '<tpl for=".">',
                        '<div class="thumb-wrap" id="{name}" onclick="that.ali(this)">',
                        '<div class="thumb" ><a ><img src="{url}" title="{name}"></a></div>',
                        '<span class="x-editable">{shortName}</span></div>',
                        '</tpl>',
                        '<div class="x-clear"></div>'
                    ],
                    multiSelect: true,
                    //height: 310,
                    trackOver: true,
                    overItemCls: 'x-item-over',
                    itemSelector: 'div.thumb-wrap',
                    emptyText: 'سندی برای نمایش موجود نیست!',
                    plugins: [
                        Ext.create('Ext.ux.DataView.DragSelector', {}),
                        Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
                    ],
                    prepareData: function (data) {
                        Ext.apply(data, {
                            shortName: Ext.util.Format.ellipsis(data.name, 15),
                            sizeString: Ext.util.Format.fileSize(data.size),
                            dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                        });
                        return data;
                    },
                    listeners: {
                        selectionchange: function (dv, nodes) {
                            //var l = nodes.length,
                            //s = l !== 1 ? 's' : '';
                            //this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
                        }
                    }
                })
            });

            this.getPanel = function () {
                return panel;
            };

            this.setGid = function (gid_) {
                gid.gid = gid_;
            };
        };
        var mapPanel = function (region, landlord) {
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
                map.addLayers([ghyb, gsat, gphy, gmap, open_streetMap_wms, AX_line, AX_point, layer]);
            };
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
                //segmentsLayer.styleMap = segmentStyleMap;

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
            
            setMap();

            styleMapInit();
			
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
					if(enterCode.getValue() != "")
						landlord.refreshLandlordWithGid(enterCode.getValue());
				}
			});
			
            var panel = Ext.create('GeoExt.panel.Map', {
                title: 'نقشه',
                map: map,
                rtl: false,
                collapsible: true,
                region: region,
                resizable: true,
                //height: 550,
                width: 400,
                zoom: 5,
				tbar: [enterCode, chooseBtn],
                center: [6122571.992777778,3489123.8364954195],
            });

            this.addLayer2Map = function (layer_) {
                map.addLayers([layer_]);
            };
            this.setVisible = function (flag) {
                panel.setVisible(flag);
            };
            this.getPanel = function () {
                return panel;
            };
            this.getLayer = function(){
                return layer;
            };
            
        };
        
        
        var imagePanel = new images('south');
        var landLord1 = new landLord("center", imagePanel);
        
		//var land = new rootThis.land("south", this);
        var mp = new mapPanel("west", landLord1);
		
        this.panel = Ext.create('Ext.Panel', {
            layout: 'border',
            items: [landLord1.getPanel(), mp.getPanel(), imagePanel.getPanel()]
        });
        
        var loadSegmentWithGid = function(gid){
            segmentLayer.refresh({params: {gid: gid}});
        };
    },
    createWindow: function () {
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('search-win');
        if (!win) {
            var allDataGridPanel = new me.allData(me);
            win = desktop.createWindow({
                id: 'search-win',
                title: 'جستجو',
                width: 1300,
                rtl: true,
                height: 400,
                iconCls: 'report-16x16',
                collapsible: true,
                constrainHeader: false,
                align: 'right',
                layout: 'fit',
                items: [allDataGridPanel.panel]
            });
        }
        return win;
    }
});
