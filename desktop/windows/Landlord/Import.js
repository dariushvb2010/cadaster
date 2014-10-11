/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.Import', {
    extend: 'Ext.ux.desktop.Module',

    requires: [],
    id:'import-win',

    init: function(){
        this.launcher = {
            text: 'افزودن قطعات از قایل اکسل',
            iconCls:'excel-16x16'
        };
    },
    
    createWindow: function(){
        
        window.open('index.php?r=import/view', '_blank');
        
    }
});

