/*!
* Ext JS Library 4.0
* Copyright(c) 2006-2011 Sencha Inc.
* licensing@sencha.com
* http://www.sencha.com/license
*/

Ext.define('MyDesktop.SystemStatus', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.chart.*'
    ],

    id: 'systemstatus',

    refreshRate: 500,

    init : function() {
        // No launcher means we don't appear on the Start Menu...
//        this.launcher = {
//            text: 'SystemStatus',
//            iconCls:'cpustats'
//        };

        Ext.chart.theme.Memory = Ext.extend(Ext.chart.theme.Base, {
            constructor: function(config) {
                Ext.chart.theme.Memory.superclass.constructor.call(this, Ext.apply({
                    colors: [ 'rgb(244, 16, 0)',
                              'rgb(248, 130, 1)',
                              'rgb(0, 7, 255)',
                              'rgb(84, 254, 0)']
                }, config));
            }
        });
    },

    createNewWindow: function () {
        var me = this,
        desktop = me.app.getDesktop();
        
        me.processArray = ['explorer', 'monitor', 'charts', 'desktop', 'Ext3', 'Ext4'];
        /*me.processesMemoryStore = Ext.create('store.json', {
            fields: ['name', 'number'],
            data: me.generateData(me.processArray)
        });*/
        
        return desktop.createWindow({
            id: 'systemstatus',
            title: 'System Status',
            width: 800,
            height: 400,
            animCollapse:false,
            constrainHeader:true,
            border: false,
            layout: {
                type: 'hbox',
                align: 'stretch'    
            },
            bodyStyle: {
                'background-color': '#FFF'
            },
            items: [{
                flex: 1,
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    //me.createMemoryPieChart(),
                    me.createProcessChart()
                ]
            }]
        });
    },

    createWindow : function() {
        var win = this.app.getDesktop().getWindow(this.id);
        if (!win) {
            win = this.createNewWindow();
        }
        return win;
    },
    
    createProcessChart: function () {
        as = new Ext.data.JsonStore({
            proxy: {
                type: 'ajax',
                url: 'index.php?r=business/chart',
                reader: {
                    type: 'json',
                    root: 'chartData'
                    //idProperty: 'name'
                }
            },

            //alternatively, a Ext.data.Model name can be given (see Ext.data.Store for an example)
            fields: ['name', 'number']
        }).reload();
        
        return {
            flex: 1,
            xtype: 'chart',
            theme: 'Category1',
            store: as,
            animate: {
                easing: 'ease-in-out',
                duration: 750
            },
            axes: [{
                type: 'Numeric',
                position: 'left',
                minimum: 0,
                //maximum: 10,
                fields: ['number'],
                title: 'تعداد',
                labelTitle: {
                    font: 'bold 16px "b mitra"'
                },
                label: {
                    font: 'bold 14px "b mitra"'
                }
            },{
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: 'اسناد و مدارک',
                labelTitle: {
                    font: 'bold 14px Arial'
                },
                label: {
                    rotation: {
                        degrees: 45
                    }
                }
            },{
                type: 'Numeric',
                position: 'top',
                fields: ['number'],
                title: 'نمایش نموداری تعداد اسناد و مدارک در خرید های ثبت شده',
                labelTitle: {
                    font: 'bold 14px Arial'
                },
                label: {
                    fill: '#FFFFFF',
                    stroke: '#FFFFFF'
                },
                axisStyle: {
                    fill: '#FFFFFF',
                    stroke: '#FFFFFF'
                }
            }],
            series: [{
                title: 'Processes',
                type: 'column',
                xField: 'name',
                yField: 'number'
            }]
        };
    },

    generateData: function (names) {
        var data = [],
            i,
            rest = names.length, consume;

        for (i = 0; i < names.length; i++) {
            consume = Math.floor(Math.random() * 100) / 10   + 12;
            //rest = rest - (consume - 5);
            data.push({
                name: names[i],
                number: consume
            });
        }

        return data;
    }
});
