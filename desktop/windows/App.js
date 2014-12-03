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
        'MyDesktop.Landlord.Register',
        //'MyDesktop.Landlord.Shopping',
        'MyDesktop.Landlord.ChangePass',
        'MyDesktop.Landlord.UserManagement',
        'MyDesktop.Landlord.AddUser',
        'MyDesktop.Landlord.AddSegment',
        'MyDesktop.Landlord.Search',
        //'MyDesktop.Landlord.Test',
        'MyDesktop.LandLord.Chart',
        'MyDesktop.Settings',
        'MyDesktop.Landlord.Import',
        'MyDesktop.Landlord.Shop',
        'MyDesktop.SystemStatus'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

    getModules : function(){
        return [
            new MyDesktop.Landlord.Register(),
            //new MyDesktop.Landlord.Shopping(),
            new MyDesktop.Landlord.ChangePass(),
            new MyDesktop.Landlord.UserManagement(),
            new MyDesktop.Landlord.AddSegment(),
            new MyDesktop.Landlord.Search(),
            //new MyDesktop.Landlord.Test(),
            new MyDesktop.Landlord.Import(),
            new MyDesktop.SystemStatus(),
            new MyDesktop.LandLord.Chart(),
            new MyDesktop.Landlord.Shop()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        var empty = Ext.apply(ret, {
            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],
            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name:  "ثبت خرید", iconCls: 'grid-shortcut',  module: 'shop-win'},
                    { name:  "نمودار", iconCls: 'chart-48x48',  module: 'chart-win'},
                    { name:  "افزدون قطعه", iconCls: 'add-segment-48x48',  module: 'addSegment-win'},// module: 'addSegment-win'},
                    { name:  "افزدون قطعات از اکسل", iconCls: 'excel-48x48',  module: 'import-win'},
                    { name:  "گزارشگیری", iconCls: 'report-48x48',  module: 'search-win'},
                    { name: 'مدیریت کاربران', iconCls: 'userManagement-48x48', module: 'userManagement-win' },
                    { name: 'تغییر رمز عبور', iconCls: 'changePassword-48x48', module: 'changePass-win' },
                    { name: 'نمایش آزمایشی نمودار', iconCls: 'cpu-shortcut', module: 'systemstatus'}
                ]
            }),
            
            //wallpaper: 'wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
        
        return empty;
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: '(TKA)تیوکاوان اطلس',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [{
                        text:'مدیریت کاربران',
                        iconCls:'userManagement-16x16',
                        handler: function () { location.href = "index.php?r=user/admin"; location.target="_blank" },
                        scope: me
                    },
                    '-',
                    {
                        text:'خروج',
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
                { name: 'مدیریت کاربران', iconCls: 'userManagement-16x16', module: 'userManagement-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('خروج', 'مطمئن هستید که میخواهید از سامانه خارج شوید؟', function(btn){
            console.log("In the name of Allah");
            if(btn === 'yes'){
                window.open('index.php?r=user/logout', '_parent');
            }
        });
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
