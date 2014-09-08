/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.ChangePass', {
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
    id:'changePass-win',

    init : function(){
        this.launcher = {
            text: 'تغییر رمز عبور',
            iconCls:'changePassword-16x16'
        };
    },
    
    AllData : function(){},

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('changePass-win');
        if(!win){
            var currentPass = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'currentPass',
                fieldLabel: 'رمز فعلی',
                allowBlank: false
            });

            var newPass = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'newPass',
                fieldLabel: 'رمز جدید',
                allowBlank: false
            });

            var reNewPass = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'reNewPass',
                fieldLabel: 'تکرار رمز جدید',
                allowBlank: false
            });

            var form= Ext.widget('form', {
                items: [currentPass, newPass, reNewPass],
                layout: {type: 'vbox',align: 'stretch'},
                bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
                buttons: [{
                    text: 'تغییر',
                    disabled: true,
                    formBind: true,
                    handler: function(){
                        this.up('form').getForm().submit({
                            url: 'index.php?r=landlord/register',
                            submitEmptyText: false,
                            waitMsg: 'در حال ارسال داده ها ...',
                            success: function(form, action) {
                               Ext.MessageBox.alert('Status', 'رمز عبور شما با موفقیت تغییر یافت.', function(){win.close();});
                            },
                            failure: function(form, action) {
                                Ext.MessageBox.alert('Status', 'رمز عبور شما تغییر نیافت');
                            }
                        });
                    }
                },{
                    text: 'بی خیال',
                    handler: function(){win.close();}
                }]
            });
            
            win = desktop.createWindow({
                id: 'changePass-win',
                title:'تغییر رمز عبور',
                width:300,
                rtl: true,
                height:170,
                iconCls: 'changePassword-16x16',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                items: [form]
            });
        }
        return win;
    }
});

