Ext.define('{appName}.view.dashboard.DashboardView', {
    // extend: 'Ext.dashboard.Dashboard',
    xtype: 'dashboardview',
    renderTo: document.body,
    maxColumns: 2,
    stateful: true,
    stateId: 'simple-dashboard',
    columnWidths: [0.5, 0.5],
    parts: {
        widget1: {
            viewTemplate: {
                title: 'Widget 1',
                html: 'Widget 1'
            }
        },
        widget2: {
            viewTemplate: {
                title: 'Widget 2',
                html: 'Widget 2'
            }
        },
        widget3: {
            viewTemplate: {
                title: 'Widget 3',
                html: 'Widget 3'
            }
        }
    },
    defaultContent: [{
        type: 'widget1',
        columnIndex: 0
    }, {
        type: 'widget3',
        columnIndex: 0
    }, {
        type: 'widget2',
        columnIndex: 1
    }]
})