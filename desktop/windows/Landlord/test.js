/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Test', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.ux.upload.*',
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
    id:'test-win',

    init : function(){
        this.launcher = {
            text: 'آزمایشی',
            iconCls:'shopLand-16x16'
        };
    },
    
    createWindow : function(){
        console.log("in the name of Allah");
        var gid = 123;
        var userId = 234;
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('test-win');
        /////////////////////////////////////
        file = Ext.create('Ext.form.field.File', {
            fieldLabel: 'فایل',
            emptyText: 'emptyText',
            name: 'file',
            buttonText: 'انتخاب',
            buttonConfig: {
                iconCls: 'upload-icon'
            }
        });
        dialog = Ext.create('Ext.ux.upload.Dialog', {
            dialogTitle: 'My Upload Widget',
            uploadUrl: 'upload.php'
        });
        
        panel = Ext.create('Ext.ux.upload.Panel', {
            uploader: 'Ext.ux.upload.uploader.FormDataUploader',
            uploaderOptions: {
                url: 'index.php?r=business/upload&gid='+gid+'&userId='+userId,
                //params: {gid: gid, userId: userId},
                timeout: 120*100
            }
        });
        
        var refreshHasImages = function(){
            Ext.Ajax.request({
                url: 'refreshHasImages.php',
                params: {
                    gid: gid,
                    userId: userId,
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
        /////////////////////////////////////
        if(!win){
            win = desktop.createWindow({
                id: 'test-win',
                title:'خرید زمین',
                width:1300,
                rtl: true,
                height:300,
                iconCls: 'shopLand-16x16',
                collapsible: true,
                constrainHeader: false,
                align: 'right',
                layout: 'fit',
                items: [panel],
                rbar: [hasEsteshhad, hasMap, hasEstelam, hasMadarek, hasSanad, hasTayeediyeShura, hasQabz]
            });
        }
        return win;
    }
});

