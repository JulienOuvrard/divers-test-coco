
    // create the chart
    var chart;
    nv.addGraph(function() {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .color(d3.scale.category10().range())
            .duration(300)
        ;

        chart.xAxis.axisLabel('Utilité de la question');
		chart.yAxis.axisLabel('Justesse de la réponse');
        chart.xAxis.tickFormat(d3.format('.02f'));
        chart.yAxis.tickFormat(d3.format('.02f'));
		
        d3.select('#repUtile svg')
            .datum(dataUtileOk())
            .call(chart);

        nv.utils.windowResize(chart.update);
		
        return chart;
    });


    function dataUtileOk() { 
        
        var shapes = [ 'circle'];


        return [
			{
                "values": 
                [{
					"label":"dary",
					"x": 1,
					"y": 1
				}, 
				{
					"title":"zizi",
					"x": 0,
					"y": 0
				}, 
				{
					"x": -1,
					"y": -1
				}, 
				{
					"x": 1,
					"y": -1
				}, 
				{
					"x": -1,
					"y": 1
				}, 
				{
					"x": 0,
					"y": -1
				}, 
				{
					"x": -1,
					"y": 0
				}, 
				{
					"x": 1,
					"y": 0
				}, 
				{
					"x": 0,
					"y": 1
				}, 
				{
					"x": 0.5,
					"y": 0.5
				}, 
				{
					"x": -0.5,
					"y": -0.5
				}, 
				{
					"x": -0.5,
					"y": 0.5
				}, 
				{
					"x": 0.5,
					"y": -0.5
				}]
			}];
    }

