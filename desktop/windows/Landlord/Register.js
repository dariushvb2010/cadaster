/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Register', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id:'register-win',

    /*init : function(){
        this.launcher = {
            text: 'ثبت مالک',
            iconCls:'icon-grid'
        };
    },*/
    
    form : function(myThis){
        var firstName = Ext.create('Ext.form.TextField', {
            flex: 2,
            name: 'FirstName',
            //afterLabelTextTpl: required,
            fieldLabel: 'نام',
            allowBlank: false
        });
        
        var lastName = Ext.create('Ext.form.TextField', {
            name: 'LastName',
            //afterLabelTextTpl: required,
            fieldLabel: 'نام خانوادگی',
            allowBlank: false,
            flex: 2,
            margins: '0 0 0 5'
        });
        
        var dadName = Ext.create('Ext.form.TextField', {
            name: 'DadName',
            flex: 1,
            //afterLabelTextTpl: required,
            fieldLabel: 'نام پدر',
            allowBlank: false,
            margins: '0 0 0 5'
        });
        
        var address = Ext.create('Ext.form.TextArea', {
            flex: 1,
            name: 'Address',
            //afterLabelTextTpl: required,
            fieldLabel: 'محل سکونت فعلی',
            allowBlank: false
        });
        
        var shareres = Ext.create('Ext.form.TextField', {
            flex: 1,
            name: 'Sharers',
            //afterLabelTextTpl: required,
            fieldLabel: 'شرکاء',
            allowBlank: false
        });
        
        var form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            bodyPadding: 10,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            items: [{
                xtype: 'fieldcontainer',
                //fieldLabel: 'Your Name',
                labelStyle: 'font-weight:bold;padding:0;',
                layout: 'hbox',
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top'
                },

                items: [firstName, lastName, dadName]
            }, {
                xtype: 'fieldcontainer',
                //fieldLabel: 'Your Name',
                labelStyle: 'font-weight:bold;padding:0;',
                layout: 'hbox',
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top'
                },

                items: [shareres]
            }, address],
            buttons: [{
                text: 'Load',
                handler: function(){
                }
            }, {
                text: 'Submit',
                disabled: true,
                formBind: true,
                handler: function(){
                    this.up('form').getForm().submit({
                        url: 'index.php?r=landlord/register',
                        submitEmptyText: false,
                        waitMsg: 'Saving Data...',
                        success: function(form, action) {
                           Ext.Msg.alert('success', action.result.success);
                           win.close();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failed', action.result.failure);
                        }
                    });
                }
            }]
        });
        
        var desktop = myThis.app.getDesktop();
        
        var win = desktop.getWindow('register-win');
        
        if(!win){
            
            win = desktop.createWindow({
                id: 'register-win',
                title:'ثبت مالک',
                width:700,
                rtl: true,
                height:230,
                iconCls: 'icon-grid',
                collapsible: true,
                constrainHeader:false,
                align: 'right',
                layout: 'fit',
                items: [form]
            });
        }
        
        this.getWin = function (){
            return win;
        };
    },

    createWindow : function(){
        
        var form = new this.form(this);
        
        return form.getWin();
    }
});
