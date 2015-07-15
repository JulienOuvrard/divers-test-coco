
    var width = 1000,
        height = 80,
        margin = {top: 5, right: 10, bottom: 20, left: 1};

    var chart = nv.models.bulletChart()
            .width(width - margin.right - margin.left)
            .height(height - margin.top - margin.bottom);

    var chart2 = nv.models.bulletChart()
            .width(width - margin.right - margin.left)
            .height(height - margin.top - margin.bottom);

    dataBulletChart = [
        {
			"title":"Moyenne",
			"subtitle":"vidéo 1",
			"ranges":[0,0,20],
			"measures":[12],
			"markers":[17],
			"markerLabels":['Moyenne générale'],
			"rangeLabels":[''],
			"measureLabels":['Moyenne étudiant']
        },
        
        {
			"title":"Moyenne",
			"subtitle":"vidéo 2",
			"ranges":[0,0,20],
			"measures":[8],
			"markers":[12],
			"markerLabels":['Moyenne générale'],
			"rangeLabels":[''],
			"measureLabels":['Moyenne étudiant']
		},
        {
			"title":"Moyenne",
			"subtitle":"vidéo 3",
			"ranges":[0,0,20],
			"measures":[18],
			"markers":[9],
			"markerLabels":['Moyenne générale'],
			"rangeLabels":[''],
			"measureLabels":['Moyenne étudiant']
		}
    ];

    

    //TODO: to be consistent with other models, should be appending a g to an already made svg, not creating the svg element
    var vis = d3.select('#bulletChartAllStudentssvg')
        .data(dataBulletChart)
        .enter().append("svg")
        .attr("class", "bullet nvd3")
        .attr("width", width)
        .attr("height", height);

    vis.transition().call(chart);
