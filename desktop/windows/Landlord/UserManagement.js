/* 
 * in the name of Allah
 * 
 * salam bar Mahdi
 */


Ext.define('MyDesktop.Landlord.UserManagement', {
    extend: 'Ext.ux.desktop.Module',

    requires: [],
    id:'userManagement-win',

    init: function(){
        this.launcher = {
            text: 'مدیریت کاربران',
            iconCls:'userManagement-16x16'
        };
    },
    
    createWindow: function(){
        
        window.open('index.php?r=user/admin', '_blank');
        
    }
});

