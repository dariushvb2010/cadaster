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
    
    getFieldDisplay: function(fieldLabel, name, value, labelWidth, width){
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
    },
    landLordInfo: function(){
        var name = this.getFieldDisplay('نام', 'name', 'مرتضی', 30, 210);
        var family = this.getFieldDisplay('نام خانوادگی', 'family', 'ملوندی', 80, 210);
        var fatherName = this.getFieldDisplay('نام پدر', 'fatherName', 'عباسعلی', 50, 210);
        var id = this.getFieldDisplay('شماره شناسنامه', 'id', '0630072701', 85, 210);
        var nationalCode = this.getFieldDisplay('کد ملی', 'nationalCode', '0630072701', 45, 210);
        var place = this.getFieldDisplay('محل صدور', 'place', 'اسفراین', 65, 210);
        var birthday = this.getFieldDisplay('تاریخ تولد', 'birthday', '1369/06/30', 55, 210);
        var nationality = this.getFieldDisplay('تابعیت', 'nationality', 'ایرانی', 43, 210);
        
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
    },
    
    landInfo: function(){
        var ostan = this.getFieldDisplay('استان', 'name', 'آذربایجان غربی', 40, 210);
        var shahrestan = this.getFieldDisplay('شهرستان', 'family', 'خوی', 60, 210);
        var bakhsh = this.getFieldDisplay('بخش ثبتی', 'fatherName', '1 خوی', 65, 210);
        var nahiyeh = this.getFieldDisplay('ناحیه', 'id', ' ---- ', 40, 210);
        var shomareFari = this.getFieldDisplay('شماره فرعی', 'nationalCode', ' 2 ', 70, 210);
        var asli = this.getFieldDisplay('شماره اصلی', 'place', '2147', 65, 210);
        var mafrooz = this.getFieldDisplay('مفروز و مجزی از', 'birthday', ' ---- ', 90, 210);
        var gheteh = this.getFieldDisplay('قطعه', 'nationality', ' ---- ', 35, 210);
        var shomarehMelk = this.getFieldDisplay('شماره ملک به حروف', 'nationality', 'دو فرعی از دو هزار و صد و چهل و هفت اصلی مفروز از اصلی مذکور', 110, 600);
        var masahat = this.getFieldDisplay('مساحت', '', '366.2 متر مربع', 50, 210);
        var block = this.getFieldDisplay('بلوک', '', ' ---- ', 40, 210);
        var samt = this.getFieldDisplay('سمت', '', ' ---- ', 40, 210);
        var tabagheh = this.getFieldDisplay('طبقه', '', ' ---- ', 40, 210);
        var fieldset = {
            xtype: 'fieldset',
            cls: 'baseFieldset',
            title: 'مشخصات ملک    ',
            //baseCls: 'print',
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
    },
    
    
    info: function(){
        var landLord = this.landLordInfo();
        var land = this.landInfo();
        var formPanel =  Ext.create('Ext.form.Panel', {
            region: 'center',
            autoHeight: true,
            width   : 600,
            height: 300,
            bodyPadding: 10,
            bodyStyle: 'background:#ffc; padding:10px;direction: rtl; font-family: b mitra; float: right;',
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            items   : [landLord, land]
        });
        
        return formPanel;
    },
    
    launch: function(){
        data = window.opener.params;
        var map = new OpenLayers.Map({numZoomLevels:21});
        var loadEnd = function(e){
            if(e.response.features.length<1) return;
            
            map.zoomToExtent(segmentsLayer.getDataExtent());
        };
        
        segmentsLayer = new OpenLayers.Layer.Vector("لایه قطعات یک زمین", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                params: {userId: window.opener.params.userId},
                readWithPOST: true,
                url: "index.php?r=land/features",
                format: new OpenLayers.Format.GeoJSON({})
            })
        });
        segmentsLayer.events.register('loadend', this, loadEnd);
        
        var rootThis = this;
        var infoPanle = rootThis.info();
        
        
        map.addLayers([segmentsLayer]);
        var scaleLine = new OpenLayers.Control.ScaleLine();
        map.addControl(scaleLine);
        scaleLine.activate();
        var wms = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0?",
            {layers: 'basic'}
        );
        map.addLayers([wms]);
        
        
        var mappanel = Ext.create('GeoExt.panel.Map', {
            //title: 'Using GeoExt.Action instances in various places',
            region: 'south',
            width: 400,
            height: 200,
            map: map
        });
        
        var mainPanel2 = Ext.create('Ext.form.Panel', {
            //renderTo: "printPanel",
            region: 'south',
            layout: "border",
            height: 600,
            width: 200,
            border: 10,
            items: [mappanel]
        });
        
        var mainPanel = Ext.create('Ext.Panel', {
            renderTo: "printPanel",
            layout: "border",
            height: 600,
            width: 920,
            border: 10,
            items: [mainPanel2, infoPanle]
        });
    }
});
