Ext.define('{appName}.view.dashboard.DashboardView', {
    extend: 'Ext.chart.CartesianChart',
    xtype : 'chartview',
    height: 400,
    innerPadding: '0 130 0 10',
    flipXY: true,
    store: {
        fields: ['name', 'count'],
        data: [
    {"name": "Jan", "count": 0},
    {"name": "Feb", "count": 2},
    {"name": "Mar", "count": 2},
    {"name": "Apr", "count": 5},
    {"name": "May", "count": 5}
    ]    },

    //set legend configuration
    legend: {
        position: 'right'
    },

    //define the x and y-axis configuration.
    axes: [{
        type: 'numeric3d',
        position: 'bottom',
        title: { text: 'Count', font: 16 },
        grid: true,
        minimum: 0
        //label: {
        //  rotate: {
        //    degrees: -90
        //}
        //}
    }, {
        type: 'category3d',
        position: 'left',
        title: { text: 'Month', font: 16 }
    }],

    //define the actual bar series.
    series: [{
        type: 'bar3d',
        stacked: false,
        xField: 'name',
        yField: ['count'],
        highlight: true
    }],
     sprites: {
         type: 'text',
         text: 'Chart by month',
         font: '15px Helvetica',
         x: 500,
         y: 50
     }
});
