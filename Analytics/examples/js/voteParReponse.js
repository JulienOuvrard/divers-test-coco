
    dataAnswers = [
        {
            key: "Cumulative Return",
            values: [
                {
                    "label" : "A" ,
                    "value" : 3 ,
                    "color" : "gray"
                } ,
                {
                    "label" : "B" ,
                    "value" : 1,
                    "color" : "green"
                } ,
                {
                    "label" : "C" ,
                    "value" : 1,
                    "color" : "gray"
                } ,
                {
                    "label" : "D" ,
                    "value" : 1,
                    "color" : "gray"
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
        d3.select('#voteParRep svg')
            .datum(dataAnswers)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
