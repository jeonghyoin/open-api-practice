var $danger = "#D66061";
var $yellow = "#ffee00";


// Sparkline Graphs
$(function () {
    $('#projects').sparkline([320,250,400,380,280,320,220,385,450], {
        type: 'line',
        lineWidth: 3,
        fillColor: false,
        lineColor: '#058DC7',
        spotColor: '#e13f3d',
        minSpotColor: '#50B432',
        maxSpotColor: '#f7b53c',
        highlightSpotColor: '#',
        height: 60,
        width: 120,
        spotRadius: 6,
    });
    $('#sparkline1').sparkline([5, 6, 2, 8, 9, 4, 7, 10, 11, 12, 7], {
        type: 'bar',
        height: '80',
        barWidth: '10',
        barWidth: 2,
        barSpacing: 10,
        chartRangeMin: 0,
        barColor: '#e6ecf5'
    });

    $("#downloads").sparkline([290,320,310,365,420,320,350,370,320], {
        type: 'bar',
        barWidth: 10,
        height: 60,
        width: 120,    
        barSpacing: 5,
        barColor: '#058DC7',
        negBarColor: '#ffffaa'
    });
     $(".watch1").sparkline([2,4,4,6,8,5,6,4,8,6,6,2 ], {
        type: 'line',
        width: '100%',
        height: '80',
        lineColor: '#13dafe',
        fillColor: 'rgba(19, 218, 254, 0.3)',
        maxSpotColor: '#99d683',
        highlightLineColor: 'rgba(0, 0, 0, 0.2)',
        highlightSpotColor: 'rgba(0,0,0,.2)'
    });
    $('.watch2').sparkline([0,13,10,14,15,10,18,15,19], {
        type: 'line',
        width: '100%',
        height: '80',
        lineColor: '#6164c1',
        fillColor: 'rgba(97, 100, 193, 0.3)',
        highlightLineColor: 'rgba(0,0,0,.1)',
        highlightSpotColor: 'rgba(0,0,0,.2)'
    });
     $(".watch3").sparkline([0,2,8,6,8,5,6,4,8,6,6,2 ], {
        type: 'line',
        width: '100%',
        height: '80',
        lineColor: '#fa8282',
        fillColor: 'rgba(255,211,152,.8)',
        minSpotColor:'#13dafe',
        maxSpotColor: '#13dafe',
        highlightLineColor: 'rgba(0, 0, 0, 0.2)',
        highlightSpotColor: '#13dafe'
    });
    $(".watch4").sparkline([3,7,5,6,8,7,6,7,8,6,6,9 ], {
        type: 'line',
        width: '100%',
        height: '80',
        lineColor: '#13dafe',
        fillColor: 'rgba(153,214,131,.7)',
        minSpotColor:'#13dafe',
        maxSpotColor: '#13dafe',
        highlightLineColor: 'rgba(0, 0, 0, 0.2)',
        highlightSpotColor: '#13dafe'
    });
    $(".watch5").sparkline([2,5,6,6,9,5,7,7,8,5,6,8 ], {
        type: 'line',
        width: '100%',
        height: '80',
        lineColor: '#fc6180',
        fillColor: 'rgba(252, 97, 128, 0.3)',
        maxSpotColor: '#99d683',
        highlightLineColor: 'rgba(0, 0, 0, 0.2)',
        highlightSpotColor: 'rgba(0,0,0,.2)'
    });

     $(".profile1").sparkline([0,2,8,6,8,5,6,4,8,6,6,2 ], {
        type: 'bar',
        width: '100%',
        height: '50',
        barColor: '#fa8282',
        fillColor: 'rgba(255,211,152,.8)',
        minSpotColor:'#13dafe',
        maxSpotColor: '#13dafe',
        highlightLineColor: 'rgba(0, 0, 0, 0.2)',
        highlightSpotColor: '#13dafe'
    });
    $(".profile2").sparkline([3,7,5,6,8,7,6,7,8,6,6,9 ], {
        type: 'bar',
        width: '100%',
        height: '50',
        barColor: '#13dafe',
        fillColor: 'rgba(153,214,131,.7)',
        minSpotColor:'#13dafe',
        maxSpotColor: '#13dafe',
        highlightLineColor: 'rgba(0, 0, 0, 0.2)',
        highlightSpotColor: '#13dafe'
    });
    $(".profile3").sparkline([2,5,6,6,9,5,7,7,8,5,6,8 ], {
        type: 'bar',
        width: '100%',
        height: '50',
        barColor: '#72a1ec'
    });

    $("#total-applications").sparkline([212,257,284,315,365,383,358,371,329,295,321,392,316,423,477,495,419], {
        type: 'line',
        lineWidth: 3,
        fillColor: false,
        lineColor: '#058DC7',
        spotColor: '#e13f3d',
        minSpotColor: '#50B432',
        maxSpotColor: '#f7b53c',
        highlightSpotColor: '#',
        height: 40,
        width: 180,
        spotRadius: 5,
    });
});


// Flot Donut Chart
$(function () {
    var data, chartOptions;
    data = [
        { label: "", data: Math.floor (Math.random() * 100 + 140) }, 
        { label: "", data: Math.floor (Math.random() * 100 + 30) },
        { label: "", data: Math.floor (Math.random() * 100 + 60) }, 
        { label: "", data: Math.floor (Math.random() * 100 + 90) }, 
        { label: "", data: Math.floor (Math.random() * 100 + 120) }, 
    ];
    chartOptions = {        
        series: {
            pie: {
                show: true,  
                innerRadius: .8, 
                stroke: {
                    width: 1,
                }
            }
        }, 
        shadowSize: 0,
        legend: {
            position: 'sw'
        },
        tooltip: true,

        tooltipOpts: {
            content: '%s: %y'
        },
        grid:{
            hoverable: false,
            clickable: false,
            borderWidth: 0,
        },
        shadowSize: 0,
        colors: ['#F782AA', '#0084B4', '#3FC5AC', '#FFD06B', '#CCCCCC'],
    };
    var holder = $('#advertising');
    if (holder.length) {
        $.plot(holder, data, chartOptions );
    }   
});