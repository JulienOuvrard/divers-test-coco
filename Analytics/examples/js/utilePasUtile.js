  dataUtile = [
        {
            key: "Cumulative Return",
            values: [
                {
                    "label" : "Utile" ,
                    "value" : 5 ,
                    "color" : "#008030"
                } ,
                {
                    "label" : "Pas utile" ,
                    "value" : 2,
                    "color" : "#D00010"
                } ,
                {
                    "label" : "Ne se prononce pas" ,
                    "value" : 8,
                    "color" : "#DCDCDC"
                }
            ]
        }
    ];

    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true)
            //.staggerLabels(historicalBarChart[0].values.length > 8)
            .showValues(true)
            .duration(250)
            ;

		chart.yAxis.axisLabel('Nombre de réponses');
        d3.select('#utilePasUtile svg')
            .datum(dataUtile)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });

