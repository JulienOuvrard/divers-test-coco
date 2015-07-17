var expandLegend = function() {
            var exp = chart.legend.expanded();
            chart.legend.expanded(!exp);
            chart.update();
        }
        
        

    // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
    var chart;
    var data;

    var randomizeFillOpacity = function() {
        var rand = Math.random(0,1);
        for (var i = 0; i < 100; i++) { // modify sine amplitude
            data[4].values[i].y = Math.sin(i/(5 + rand)) * .4 * rand - .25;
        }
        data[4].fillOpacity = rand;
        chart.update();
    };

    nv.addGraph(function() {
        chart = nv.models.lineChart()
            .useInteractiveGuideline(false)
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] })
            .color(d3.scale.category10().range())
            .duration(300)
            .clipVoronoi(false);

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis.axisLabel('Date');
		chart.yAxis.axisLabel('Note');
        chart.xAxis.tickFormat(function(d) {
            return d3.time.format('%d/%m/%y')(new Date(d))
        });

        chart.yAxis.tickFormat(d3.format('1'));

        

        d3.select('#nbViewer svg')
            .datum(dataViewer())
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });

    function dataViewer() {
        return [
            {
                key: "Nombre d'utilisateurs",
                 values: [	[new Date(2014,08),0],
							[new Date(2014,10),6],
							[new Date(2014,11),2],
							[new Date(2015,00),10],
							[new Date(2015,01),2],
							[new Date(2015,02),14],
							[new Date(2015,03),9],
							[new Date(2015,04),15],
							[new Date(2015,05),20],
							[new Date(2015,06),7]]
			}
            
        ];
    }
