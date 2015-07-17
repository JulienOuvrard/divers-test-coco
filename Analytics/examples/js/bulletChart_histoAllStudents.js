 var width = 760,
        height = 80,
        margin = {top: 5, right: 40, bottom: 20, left: 120};

    var chart = nv.models.bulletChart()
            .width(width - margin.right - margin.left)
            .height(height - margin.top - margin.bottom);

    data = [
        {
			"title":"Moyenne",
			"subtitle":"vidéo 1",
			"ranges":[0,0,20],
			"measures":[12],
			"markers":[17],
			"markerLabels":['Moyenne générale'],
			"measureLabels":['Moyenne étudiant']
        },
        
        {
			"title":"Moyenne",
			"subtitle":"vidéo 2",
			"ranges":[0,0,20],
			"measures":[8],
			"markers":[12],
			"markerLabels":['Moyenne générale'],
			"measureLabels":['Moyenne étudiant']
		},
        {
			"title":"Moyenne",
			"subtitle":"vidéo 3",
			"ranges":[0,0,20],
			"measures":[18],
			"markers":[9],
			"markerLabels":['Moyenne générale'],
			"measureLabels":['Moyenne étudiant']
		}
    ];
    
    //TODO: to be consistent with other models, should be appending a g to an already made svg, not creating the svg element
    var vis = d3.select("#bulletChartAllStudents").selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("class", "bullet nvd3")
        .attr("width", width)
        .attr("height", height);

    vis.transition().duration(1000).call(chart);
