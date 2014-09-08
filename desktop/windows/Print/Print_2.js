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
    
    info: function(landInfo, region){
        
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
        var land = function(){
            var ostan = getFieldDisplay('استان', 'name', 'آذربایجان غربی', 40, 210);
            var shahrestan = getFieldDisplay('شهرستان', 'family', 'خوی', 60, 210);
            var bakhsh = getFieldDisplay('بخش ثبتی', 'fatherName', '1 خوی', 65, 210);
            var nahiyeh = getFieldDisplay('ناحیه', 'id', ' ---- ', 40, 210);
            var shomareFari = getFieldDisplay('شماره فرعی', 'nationalCode', ' 2 ', 70, 210);
            var asli = getFieldDisplay('شماره اصلی', 'place', '2147', 65, 210);
            var mafrooz = getFieldDisplay('مفروز و مجزی از', 'birthday', ' ---- ', 90, 210);
            var gheteh = getFieldDisplay('قطعه', 'nationality', ' ---- ', 35, 210);
            var shomarehMelk = getFieldDisplay('شماره ملک به حروف', 'nationality', 'دو فرعی از دو هزار و صد و چهل و هفت اصلی مفروز از اصلی مذکور', 110, 600);
            var masahat = getFieldDisplay('مساحت', '', '366.2 متر مربع', 50, 210);
            var block = getFieldDisplay('بلوک', '', ' ---- ', 40, 210);
            var samt = getFieldDisplay('سمت', '', ' ---- ', 40, 210);
            var tabagheh = getFieldDisplay('طبقه', '', ' ---- ', 40, 210);
            var fieldset = {
                xtype: 'fieldset',
                cls: 'baseFieldset',
                title: 'مشخصات ملک    ',
                rtl: true,
                defaults: {layout: {type: 'hbox', align: 'stretch', itemCls: 'layout'}},
                items: [{
                    xtype: 'fieldcontainer',
                    items: [ostan, shahrestan, bakhsh, nahiyeh]
                },{
                    xtype: 'fieldcontainer',
                    items: [shomareFari, asli, mafrooz, gheteh]
                }, {
                    xtype: 'fieldcontainer',
                    items: [shomarehMelk]
                }, {
                    xtype: 'fieldcontainer',
                    items: [masahat, block,  samt, tabagheh]
                }]
            };

            return fieldset;
        };
        var landLord = function(info){
            var name = getFieldDisplay('نام', 'name', info.name, 30, 210);
            var family = getFieldDisplay('نام خانوادگی', 'family',info.family, 80, 210);
            var fatherName = getFieldDisplay('نام پدر', 'fatherName', info.fatherName, 50, 210);
            var id = getFieldDisplay('شماره شناسنامه', 'id', '0630072701', 85, 210);
            var nationalCode = getFieldDisplay('کد ملی', 'nationalCode', '0630072701', 45, 210);
            var place = getFieldDisplay('محل صدور', 'place', 'اسفراین', 65, 210);
            var birthday = getFieldDisplay('تاریخ تولد', 'birthday', '1369/06/30', 55, 210);
            var nationality = getFieldDisplay('تابعیت', 'nationality', 'ایرانی', 43, 210);

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
                    items: [name, family, fatherName, id]
                },{
                    xtype: 'fieldcontainer',
                    items: [nationalCode, birthday, place, nationality]
                }]
            };

            return fieldset;
        };
        

        var landLordFieldset = landLord(landInfo);
        var landFieldset = land(landInfo);
        
        return Ext.create('Ext.form.Panel', {
            region: region,
            autoHeight: true,
            height: 300,
            bodyPadding: 10,
            bodyStyle: 'background:#ffc; padding:10px;direction: rtl; font-family: b mitra; float: right;',
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items   : [landLordFieldset, landFieldset]
        });
    },
    
    geo: function (obj, region){
        //right = obj.right;
        /*
         * input: features: features that recived from server
         * that can be obj.right, obj.range, obj.left
        */
        var addLayer = function(features){
            var length = features.length;
            var i = 0;
            while(i<length){
                var j=0;
                var geoPoints = [];
                while(j<features[i].length){
                    pointLayer.addFeatures([new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(features[i][j][0], features[i][j][1])
                    )]);
                    geoPoints.push(new OpenLayers.Geometry.Point(features[i][j][0], features[i][j][1]));
                    j++;
                }
                vectorLayer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing(geoPoints))]);
                i++;
            }
            
        };
        var getFieldDisplay = function(fieldLabel, name, value, labelWidth, width, cls){
            return Ext.create('Ext.form.field.Display', {
                fieldLabel: fieldLabel,
                name: name,
                value: value,
                labelWidth: labelWidth,
                width: width,
                //height: 15,
                labelCls: cls,
                fieldCls: cls
            });
        };
        var getCoordinatePanel = function(){
            var getFieldDisplayItems = function(e){
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
            });
        };
        
        var map = new OpenLayers.Map({numZoomLevels:21});
        var pointLayer = new OpenLayers.Layer.Vector("point layer");
        var vectorLayer = new OpenLayers.Layer.Vector("vector layer");
        addLayer(obj.right);
        addLayer(obj.left);
        addLayer(obj.range);
        
        
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
            //width: 400,
            height: 200,
            map: map
        });
        
        var coordinatePanel = getCoordinatePanel();
        
        var centerPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            height: 600,
            items: [coordinatePanel, mapPanel]
        });
        map.zoomToExtent(pointLayer.getDataExtent());
        map.zoomToExtent(pointLayer.getDataExtent());
        return centerPanel;
    },
    
    printPanel: function(obj, rootThis){
        var infoPanel = rootThis.info(obj.landInfo, 'north');
        var geoPanel = rootThis.geo(obj, "center");
        
        var mainPanel = Ext.create('Ext.Panel', {
            renderTo: "printPanel",
            layout: "border",
            height: 1100,
            width: 920,
            border: 10,
            items: [infoPanel, geoPanel]
        });
    },
    
    launch: function(){
        var postData = {userId:23}; //insert your data to post here
        
        var rootThis = this;
        
        var request = new OpenLayers.Request.POST({
            //url: "index.php?r=land/features",
            url: "index.php?r=landlord/printtest",
            params: postData,
            headers: {
                "Content-Type": "text/xml;charset=utf-8"
            },
            callback: function (response) {
                obj = eval ('(' + response.responseText + ')');
                
                var printPanel = rootThis.printPanel(obj, rootThis);
               
            },
            failure: function (response) {
                alert("Something went wrong in the request");
            }
        });
    }
});