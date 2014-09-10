/*
 * Copyright (c) 2008-2014 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full
 * text of the license.
 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.window.MessageBox',
    'GeoExt.panel.Map',
    'GeoExt.Action'
]);

Ext.application({
    name: 'ActionExample',
    
    info: function(lord, land, region){
        var getFieldDisplay = function(fieldLabel, name, value, labelWidth, width){
            //var labelWidth = fieldLabel.length * 7 + 10;
            //var width = 210;//value.length * 5 + 55 + labelWidth;
            return Ext.create('Ext.form.field.Display', {
                fieldLabel: fieldLabel,
                name: name,
                value: value,
                labelWidth: labelWidth,
                width: width,
                height: 30,
                labelAlign: 'right',
                labelCls: 'mmLabel',
                fieldCls: 'mmField'
            });
        };
        var landFieldSet = function(){
            var plantType = getFieldDisplay('نوع کشت', 'plantType', land.plantType, 60, 210);
            var waterType = getFieldDisplay('نوع آبیاری', 'waterType', land.waterType, 60, 210);
            var usingType = getFieldDisplay('نوع کاربری', 'usingType', land.usingType, 65, 210);
            var docStatus = getFieldDisplay('وضعیت سند', 'docStatus', land.docStatus, 68, 210);
            var fieldset = {
                xtype: 'fieldset',
                cls: 'baseFieldset',
                title: 'مشخصات ملک    ',
                rtl: true,
                defaults: {layout: {type: 'hbox', align: 'stretch', itemCls: 'layout'}},
                items: [{
                    xtype: 'fieldcontainer',
                    items: [plantType, waterType, usingType, docStatus]
                }]
            };

            return fieldset;
        };
        var landLordFieldSet = function(){
            var name = getFieldDisplay('نام', 'name', lord.FirstName, 25, 210);
            var family = getFieldDisplay('نام خانوادگی', 'family',lord.LastName, 70, 210);
            var fatherName = getFieldDisplay('نام پدر', 'fatherName', lord.DadName, 40, 210);
            var nationalCode = getFieldDisplay('کد ملی', 'nationalCode', lord.codeMelli, 45, 210);
            var phone = getFieldDisplay('شماره تلفن', 'phone', lord.phone, 60, 210);
            var ostan = getFieldDisplay('استان', 'ostna', lord.ostan, 35, 210);
            var shahrestan = getFieldDisplay('شهرستان', 'shahrestan', lord.shahrestan, 55, 210);
            var village = getFieldDisplay('روستا', 'villageName', lord.villageName, 33, 210);

            var fieldset = {
                xtype: 'fieldset',
                title: 'مشخصات مالک',
                cls: 'baseFieldset',
                rtl: true,
                defaults: {
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        itemCls: 'layout'
                    }
                },
                items: [{
                    xtype: 'fieldcontainer',
                    items: [name, family, fatherName, nationalCode]
                },{
                    xtype: 'fieldcontainer',
                    items: [ostan, shahrestan, village, phone]
                }]
            };

            return fieldset;
        };
        

        var landLordFieldset = landLordFieldSet();
        var landFieldset = landFieldSet();
        
        return Ext.create('Ext.form.Panel', {
            region: region,
            autoHeight: true,
            //height: 175,
            bodyStyle: 'background:#ffc; padding:10px;direction: rtl; font-family: b mitra; float: right;',
            items   : [landLordFieldset, landFieldset]
        });
    },
    
    geo: function (obj, region){
        //right = obj.right;
        /*
         * input: features: features that recived from server
         * that can be obj.right, obj.range, obj.left
        */
        var colors = ['blue', 'red', 'green', 'pink'];
        var rightColors = ['#2900FF', '#00ADFF', '#00FFFF', '#000000'];
        var leftColors = ['#FF0000', '#FF00B8', '#AD00FF', '#000000'];
        var inColors = ['#00FF00', '#F5FF00', '#FFC200', '#000000'];
        var getPointStyleMap = function(){
            
            var vector_style = new OpenLayers.Style();
            var rightSideRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE,
                    property: 'side',
                    value: 'rightSide'
                }),
                symbolizer: {
                    fillColor: 'transparent', fillOpacity:'transparent', 
                    pointRadius:8, strokeColor: 'transparent', strokeOpacity: 'transparent',
                    label: '${id}', fontColor: '${color}', labelXOffset: 10
                }
            });
            var inSideRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE,
                    property: 'side',
                    value: 'inSide'
                }),
                symbolizer: {
                    fillColor: 'transparent', fillOpacity:'transparent', 
                    pointRadius:8, strokeColor: 'transparent', strokeOpacity: 'transparent',
                    label: '${id}', fontColor: '${color}', labelXOffset: 0, labelYOffset: 10
                }
            });
            var leftSideRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LIKE,
                    property: 'side',
                    value: 'leftSide'
                }),
                symbolizer: {
                    fillColor: 'transparent', fillOpacity: 0.5, 
                    pointRadius:8, strokeColor: 'transparent', strokeOpacity: 'transparent',
                    label: '${id}', fontColor: '${color}', labelXOffset: -10, labelYOffset: 0
                }
            });
           vector_style.addRules([rightSideRule, inSideRule, leftSideRule]);
           return new OpenLayers.StyleMap({
            'default': vector_style
            });
            
        };
        var getVectorStyleMap = function(){
            
            var vector_style = new OpenLayers.Style();
            var rule = new OpenLayers.Rule({
                symbolizer: {
                    fillColor: '${color}', fillOpacity: 0.1, 
                    strokeColor: '${color}', strokeOpacity: 1
                }
            });
            vector_style.addRules([rule]);
            return new OpenLayers.StyleMap({
             'default': vector_style
             });
            
        };
        var getSideFeatures = function(obj, side){
            var empty = [];
            var i = obj.features.length;
            while(i>0){
                i--;
                if(obj.features[i].properties.position.indexOf(side) > -1){
                    empty.push(obj.features[i]);
                }
            }
            return empty;
        };
        var addLayer = function(features, side, color){
            var length = features.length;
            var i = 0;
            while(i<length){
                var j=0;
                var geoPoints = [];
                //coordinates = features[i].geometry.coordinates[0][0];
                //i++;
                var coordinates = features[i].geometry.coordinates[0][0];
                while(j<coordinates.length-1){
                    pointLayer.addFeatures([new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(coordinates[j][0], coordinates[j][1]),
                        {id:j+1, side: side, color: color[i]}
                    )]);
                    geoPoints.push(new OpenLayers.Geometry.Point(coordinates[j][0], coordinates[j][1]));
                    j++;
                }
                vectorLayer.addFeatures([new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.LinearRing(geoPoints),{color: color[i]}
                )]);
                i++;
            }
        };
        var getCoordinatePanel = function(features){
            me = features;
            /*var getFieldDisplayItems = function(e){
                var i = 0;
                var items = [];
                while(i<e.length){
                    var j = 0;
                    while(j<e[i].length){
                        items.push(getFieldDisplay((j+1).toString(), 'itsme', e[i][j][1] + " " + e[i][j][1], 10, 200, 'segment'+i));
                        j++;
                    }
                    i++;
                };
                return items;
            };
            var rightItems = getFieldDisplayItems(obj.right);
            var rightPanel = Ext.create('Ext.panel.Panel', {
                titleAlign: 'center',
                title: 'محدوده راست',
                width: 310,
                region: 'east',
                items: rightItems
            });
            var rangeItems = getFieldDisplayItems(obj.range);
            var centerPanel = Ext.create('Ext.panel.Panel', {
                titleAlign: 'center',
                title: 'داخل محدوده',
                width: 305,
                region: 'center',
                //collapsible: true,
                items: rangeItems
            });
            var leftItems = getFieldDisplayItems(obj.left);
            var leftPanel = Ext.create('Ext.panel.Panel', {
                //bodyPadding: 5,  // Don't want content to crunch against the borders
                titleAlign: 'center',
                title: 'محدوده چپ',
                width: 305,
                region: 'west',
                items: leftItems
            });
            return Ext.create('Ext.panel.Panel', {
                //title: 'Salam Bar Hossein - Ext.panel.Panel - north',
                region: 'center',
                layout: {
                    type: 'hbox',       // Arrange child items vertically
                    align: 'stretch',    // Each takes up full width
                },
                draggable: true,
                resizable: true,
                items: [leftPanel, centerPanel, rightPanel]//items
            });*/
        };
        
        var getSegmentInfoPanel = function (title, features, region, color){
            me = features;
            var width = 930-15;
            var getFieldDisplay = function(fieldLabel, name, value, labelWidth, width, labelCls, fieldCls){
                return Ext.create('Ext.form.field.Display', {
                    fieldLabel: fieldLabel,
                    name: name,
                    value: value,
                    labelWidth: labelWidth,
                    width: width,
                    cls: 'mmRTL',
                    labelCls: labelCls,
                    fieldCls: fieldCls
                });
            };
            var segmentId = '';
            var numAdjacent = '';
            var area = '';
            var perimeter = '';
            var wholeArea = 0;
            var geoPoints = [];
            
            var i = 0;
            var data = [];
            while(i<features.length){
                segmentId += '<span style="color:' + color[i] + '">' + features[i].properties.gid + '</span> ';
                numAdjacent += '<span style="color:' + color[i] + '">' + features[i].properties.numAdjacent + '</span> ';
                area += '<span style="color:' + color[i] + '">' + parseFloat(features[i].properties.area).toFixed(3) + '</span> ';
                wholeArea += parseFloat(features[i].properties.area);
                perimeter += '<span style="direction:ltr;color:' + color[i] + '">' + parseFloat(features[i].properties.perimeter).toFixed(3) + '</span> ';
                var coordinates = features[i].geometry.coordinates[0][0];
                var j=0;
                while(j<coordinates.length){
                    data.push({
                        id:'<span style="color:' + color[i] + '">' + String(j+1) + '</span>',
                        x: '<span style="color:' + color[i] + '">' + coordinates[j][0] + '</span>',
                        y: '<span style="color:' + color[i] + '">' + coordinates[j][1] + '</span>'
                    });
                    j++;
                }
                i++;
            }
            
            var items = [];
            var idFieldDisplay = getFieldDisplay('کد قطعه', 'segmentId', segmentId, 50, width/3, 'mmField', 'mmSegmentsInfo');
            var numAdjacentFD = getFieldDisplay('تعداد مجاورت', 'numAdjacent', numAdjacent, 80, width/3, 'mmField', 'mmSegmentsInfo');
            var areaFD = getFieldDisplay('مساحت', 'area', area + '(' + parseFloat(wholeArea).toFixed(1) + ')', 50, width/3,  'mmField', 'mmSegmentsInfo');
            var perimeterFD = getFieldDisplay('محیط', 'perimeter', perimeter, 50, width/3,  'mmField', 'mmSegmentsInfo');
            items.push(idFieldDisplay, numAdjacentFD, areaFD, perimeterFD);
            
            Ext.create('Ext.data.Store', {
                storeId:'mmSegmentGridStore',
                fields:['id', 'x', 'y'],
                data:{'items':data},
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: 'items'
                    }
                }
            });

            var grid = Ext.create('Ext.grid.Panel', {
                store: Ext.data.StoreManager.lookup('mmSegmentGridStore'),
                columns: [
                    { text: ' ',  dataIndex: 'id', align: 'center', width: 20},
                    { text: 'x', dataIndex: 'x', flex: 1, align: 'center',height: 15 },
                    { text: 'y', dataIndex: 'y', flex: 1, align: 'center' }
                ],
                border: 0
            });
            items.push(grid);
            return Ext.create('Ext.panel.Panel', {
                title: title,
                region: region,
                titleAlign: 'center',
                resizable: true,
                items: items//[idFieldDisplay, numAdjacentFD, areaFD, perimeterFD, wholeAreaFD]
            });
        };
        
        var map = new OpenLayers.Map({numZoomLevels:21});
        var pointLayer = new OpenLayers.Layer.Vector("point layer");
        pointLayer.styleMap = getPointStyleMap();
        var modifyFeatureControl = new OpenLayers.Control.ModifyFeature(pointLayer);
        map.addControl(modifyFeatureControl);
        
        var vectorLayer = new OpenLayers.Layer.Vector("vector layer");
        vectorLayer.styleMap = getVectorStyleMap();
        var rightSideFeatures = getSideFeatures(obj, 'راست');
        var inSideFeatures = getSideFeatures(obj, 'داخل');
        var leftSideFeatures = getSideFeatures(obj, 'چپ');
        //rightSideFeatures.push(inSideFeatures[0], leftSideFeatures[0]);
        
        var rightSegmentPanel = getSegmentInfoPanel('محدوده راست', rightSideFeatures, 'east', rightColors);
        var inSegmentPanel = getSegmentInfoPanel('داخل محدوده', inSideFeatures, 'center', inColors);
        var leftSegmentPanel = getSegmentInfoPanel('محدوده چپ', leftSideFeatures, 'west', leftColors);
        
        addLayer(rightSideFeatures, 'rightSide', rightColors);
        addLayer(inSideFeatures, 'inSide', inColors);
        addLayer(leftSideFeatures, 'leftSide', leftColors);
        
        var scaleLine = new OpenLayers.Control.ScaleLine();
        map.addControl(scaleLine);
        scaleLine.activate();
        var wms = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0?",
            {layers: 'basic'}
        );
        map.addLayers([wms, pointLayer, vectorLayer]);
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            title: 'Salam Bar Mahdi Saheb Zaman - GeoExt.panel.Map - center',
            region: 'south',
            collapsible: true,
            //width: 900,
            resizable: true,
            height: 500,
            map: map
        });
        
        var segmentPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            //height: 1030,
            resizable: true,
            border: 0,
            items: [leftSegmentPanel, inSegmentPanel, rightSegmentPanel]
        });
        
        var centerPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            //height: 1700,
            items: [segmentPanel, mapPanel]
        });
        
        map.zoomToExtent(pointLayer.getDataExtent());
        map.zoomToExtent(pointLayer.getDataExtent());
        modifyFeatureControl.activate();
        map.zoomToExtent(pointLayer.getDataExtent());
        return centerPanel;
    },
    
    printPanel: function(land, lord, rootThis){
        var infoPanel = rootThis.info(lord, land.features[0].properties, 'north');
        
        var geoPanel = rootThis.geo(land, "center");
        
        var mainPanel = Ext.create('Ext.Panel', {
            renderTo: "printPanel",
            height: 1500,
            width: 930,
            items: [infoPanel, geoPanel]
        });
    },
    
    launch: function(){
        var postData = {
            userId:window.opener.params.userId,
            simplified:1
        };
        console.log('userId: ' + window.opener.params.userId);
        var rootThis = this;
        
        var request = new OpenLayers.Request.POST({
            url: "index.php?r=land/features",
            params: postData,
            headers: {
                "Content-Type": "text/xml;charset=utf-8"
            },
            callback: function (landResponse) {
                
                var request = new OpenLayers.Request.POST({
                    url: "index.php?r=myUser/info",
                    params: postData,
                    headers: {
                        "Content-Type": "text/xml;charset=utf-8"
                    },
                    callback: function (lordResponse) {
                        var land = eval ('(' + landResponse.responseText + ')');
                        var lord = eval ('(' + lordResponse.responseText + ')');
                        if (land.features.length<1){ alert('فرد دارای هیچ گونه ملکی نمی باشد.'); return;}
                        
                        var printPanel = rootThis.printPanel(land, lord, rootThis);
                    },
                    failure: function (response) {
                        alert("Something went wrong in the request");
                    }
                });
                
                
            },
            failure: function (response) {
                alert("Something went wrong in the request");
            }
        });
    }
});