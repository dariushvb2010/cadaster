/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.EditProfile', {
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
    id:'editProfile-win',

    init : function(){
        this.launcher = {
            text: 'ویرایش مشخصات',
            iconCls:'editProfile-16x16'
        };
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('editProfile-win');
        if(!win){
            
            var userModel = Ext.define('User', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'name', type: 'string'},
                    {name: 'family',  type: 'string'},
                    {name: 'email',       type: 'int'},
                    {name: 'phone',  type: 'string'}
                ],
                 validations: [
                    {type: 'format',   name: 'email', matcher: "/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/", message:"Wrong Email Format"}
                 ]
            });

            var storeModel = Ext.create('Ext.data.Store', {
                model: 'User',
                data : [
                    {name: 'مرتضی', family: 'ملوندی', email: 'malvandi.m@gmail.com', phone: '09158891701'}
                ],
                autoLoad: true
            });
            
            var name = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'name',
                fieldLabel: 'نام',
                allowBlank: false,
                value: storeModel.data.items[0].raw.name
            });
            
            var family = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'family',
                fieldLabel: 'نام خانوادگی',
                allowBlank: false,
                value: storeModel.data.items[0].raw.family
            });

            var email = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'name',
                fieldLabel: 'ایمیل',
                allowBlank: false,
                value: storeModel.data.items[0].raw.email
            });
            
            var phone = Ext.create('Ext.form.TextField', {
                width: 250,
                name: 'phone',
                fieldLabel: 'شماره تلفن',
                allowBlank: false,
                value: storeModel.data.items[0].raw.phone
            });

            var form= Ext.widget('form', {
                items: [name, family, email, phone],
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
                id: 'editProfile-win',
                title:'ویرایش مشخصات',
                width:300,
                rtl: true,
                height:200,
                iconCls: 'editProfile-16x16',
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

