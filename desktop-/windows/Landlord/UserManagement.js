/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.UserManagement', {
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
    id:'userManagement-win',

    init : function(){
        this.launcher = {
            text: 'مدیریت کاربران',
            iconCls:'userManagement-16x16'
        };
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('userManagement-win');
        if(!win){
            
            win = desktop.createWindow({
                id: 'userManagement-win',
                title:'تغییر رمز عبور',
                width:300,
                rtl: true,
                height:200,
                iconCls: 'userManagement-16x16',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                html: 'این قسمت در حال تکمیل شدن میباشد.'
                //items: [form]
            });
        }
        return win;
    }
});

