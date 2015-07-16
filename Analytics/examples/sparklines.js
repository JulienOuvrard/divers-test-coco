    function defaultChartConfig(containerId, data) {
        nv.addGraph(function() {

            var chart = nv.models.sparklinePlus();
            chart.margin({left:70})
                .x(function(d) { return d[0] })
                .y(function(d) { return d[1] })
                .showLastValue(true)
                .xTickFormat(function(d) {
                    return d3.time.format('%d/%m/%y')(new Date(d))
                });

            d3.select(containerId)
                    .datum(data)
                    .call(chart);

            return chart;
        });
    }

    defaultChartConfig("#chart1",dataSparklines(1));
    defaultChartConfig("#chart2", dataSparklines(2));
    defaultChartConfig("#chart3", dataSparklines(3));



    function dataSparklines(i) {
		
		if (i==1) {
        return [			[new Date(2014,08,22),0],
							[new Date(2014,10,16),8],
							[new Date(2014,11,25),14],
							[new Date(2015,00,01),2],
							[new Date(2015,01,13),0],
							[new Date(2015,02,31),6],
							[new Date(2015,03,14),1],
							[new Date(2015,04,29),5],
							[new Date(2015,05,08),7],
							[new Date(2015,06,10),20]];
		}
		else if (i==2) {
        return [			[new Date(2014,08,22),20],
							[new Date(2014,10,16),10],
							[new Date(2014,11,25),14],
							[new Date(2015,00,01),6],
							[new Date(2015,01,13),8],
							[new Date(2015,02,31),12],
							[new Date(2015,03,14),17],
							[new Date(2015,04,29),20],
							[new Date(2015,05,08),20],
							[new Date(2015,06,10),18]];
		}
		else if (i==3) {
        return [			[new Date(2014,08,22),14],
							[new Date(2014,10,16),17],
							[new Date(2014,11,25),4],
							[new Date(2015,00,01),1],
							[new Date(2015,01,13),10],
							[new Date(2015,02,31),16],
							[new Date(2015,03,14),8],
							[new Date(2015,04,29),2],
							[new Date(2015,05,08),20],
							[new Date(2015,06,10),19]];
		}
							

       
    }
