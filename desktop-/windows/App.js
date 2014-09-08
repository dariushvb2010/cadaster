/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',

        'Ext.ux.desktop.ShortcutModel',

        'MyDesktop.SystemStatus',
        'MyDesktop.VideoWindow',
        'MyDesktop.GridWindow',
        'MyDesktop.TabWindow',
        'MyDesktop.AccordionWindow',
        'MyDesktop.Notepad',
        'MyDesktop.BogusMenuModule',
        'MyDesktop.BogusModule',
        'MyDesktop.Landlord.Landlord',
        'MyDesktop.Landlord.Register',
        'MyDesktop.Landlord.Shopping',
        'MyDesktop.Landlord.ChangePass',
        'MyDesktop.Landlord.EditProfile',
        'MyDesktop.Landlord.UserManagement',
        'MyDesktop.Settings'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

    getModules : function(){
        return [
            new MyDesktop.Landlord.Landlord(),
            new MyDesktop.Landlord.Register(),
            new MyDesktop.Landlord.Shopping(),
            new MyDesktop.Landlord.EditProfile(),
            new MyDesktop.Landlord.ChangePass(),
            new MyDesktop.Landlord.UserManagement()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: 'همه داده ها', iconCls: 'grid-shortcut', module: 'landlord-win' },
                    { name: 'ویرایش مشخصات', iconCls: 'editProfile-48x48', module: 'editProfile-win' },
                    { name: 'مدیریت کاربران', iconCls: 'userManagement-48x48', module: 'userManagement-win' },
                    { name: 'ثبت مالک', iconCls: 'grid-shortcut', module: 'register-win' },
                    { name: 'خرید زمین', iconCls: 'shopLand-48x48', module: 'shopping-win' },
                    { name: 'تغییر رمز عبور', iconCls: 'changePassword-48x48', module: 'changePass-win' }
                ]
            }),

            //wallpaper: 'wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?');
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
