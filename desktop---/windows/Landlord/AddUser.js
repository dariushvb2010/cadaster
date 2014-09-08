/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.AddUser', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.grid.RowNumberer',
        'Ext.util.*',
        'Ext.tab.*',
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
    id:'addUser-win',

    init : function(){
        this.launcher = {
            text: 'افزودن کاربر جدید',
            iconCls:'addUser-16x16'
        };
    },
    
    form: function(me){
        var required = '<span style="color:red;font-weight:bold" data-qtip="این فیلد ضروری می باشد">*</span>';
        var name = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'name',
            fieldLabel: 'نام'
        });

        var family = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'family',
            fieldLabel: 'نام خانوادگی'
        });
        
        var username = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'username',
            fieldLabel: 'نام کاربری',
            allowBlank: false,
            afterLabelTextTpl: required
        });
        
        var password = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'password',
            fieldLabel: 'رمز عبور',
            allowBlank: false,
            inputType: 'password',
            afterLabelTextTpl: required
        });
        
        var rePassword = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'rePassword',
            fieldLabel: 'تکرار رمز عبور',
            allowBlank: false,
            inputType: 'password',
            afterLabelTextTpl: required
        });
        
        var email = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'name',
            fieldLabel: 'ایمیل',
            allowBlank: false,
            afterLabelTextTpl: required
        });

        var phone = Ext.create('Ext.form.TextField', {
            width: 250,
            name: 'phone',
            fieldLabel: 'شماره تلفن'
        });
        
        var emptyDisplayField = {
            xtype: 'displayfield',
            value: ''
        };
        
        var tabPanel = Ext.widget('tabpanel', {
            activeTab: 0,
            height: 250,
            defaults :{
                autoScroll: true,
                bodyPadding: 10
            },
            items: [{
                    title: 'اطلاعات کاربری',
                    layout: {type: 'vbox',align: 'stretch'},
                    bodyStyle: {background: '#ffc',padding: '10px',direction: 'rtl'},
                    items: [username, emptyDisplayField, emptyDisplayField, email, emptyDisplayField, emptyDisplayField, password, rePassword]
                }, {
                    title: 'اطلاعات شخصی',
                    layout: {type: 'vbox',align: 'stretch'},
                    bodyStyle: {background: 'rgb(215, 219, 255)',padding: '10px',direction: 'rtl'},
                    items: [name, family, emptyDisplayField, emptyDisplayField, phone]
                }
            ]
        });
        
        var form= Ext.widget('form', {
            items: [tabPanel],
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
                           Ext.MessageBox.alert('Status', 'رمز عبور شما با موفقیت تغییر یافت.', function(){me.closeWin();});
                        },
                        failure: function(form, action) {
                            Ext.MessageBox.alert('Status', 'رمز عبور شما تغییر نیافت');
                        }
                    });
                }
            },{
                text: 'بی خیال',
                handler: function(){me.closeWin();}
            }]
        });
        
        this.getForm = function(){
            return form;
        };

    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var me = this;
        var win = desktop.getWindow('addUser-win');
        if(!win){
            var form = new me.form(me);
            win = desktop.createWindow({
                id: 'addUser-win',
                title:'افزودن کاربر جدید',
                width: 300,
                rtl: true,
                height:250,
                iconCls: 'addUser-16x16',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                items: [form.getForm()]
            });
        }
        
        this.closeWin = function (){
            win.close();
        }
        
        return win;
    }
});

