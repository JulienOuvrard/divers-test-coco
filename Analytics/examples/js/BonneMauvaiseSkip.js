
    dataBonneMauvaiseSkip = [
        {
            key: "Cumulative Return",
            values: [
                {
                    "label" : "Bonnes réponses" ,
                    "value" : 5 ,
                    "color" : "blue"
                } ,
                {
                    "label" : "Bonnes réponses totales" ,
                    "value" : 10,
                    "color" : "green"
                } ,
                {
                    "label" : "Mauvaises réponses" ,
                    "value" : 3,
                    "color" : "blue"
                } ,
                {
                    "label" : "Mauvaises réponses totales" ,
                    "value" : 4,
                    "color" : "green"
                } ,
                {
                    "label" : "Réponses passées" ,
                    "value" : 2,
                    "color" : "blue"
                } ,
                {
                    "label" : "Réponses passées totales" ,
                    "value" : 5,
                    "color" : "green"
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
            .duration(250);
            
            
		chart.yAxis.axisLabel('Nombre de réponses');

        d3.select('#bonneMauvaiseSkip svg')
            .datum(dataBonneMauvaiseSkip)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
