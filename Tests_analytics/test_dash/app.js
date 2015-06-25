var sumByKey = function(array, keyField, keyValue){
	var sum = 0;
	for(var i=0, len=array.length; i<len; i++){
		if(array[i][keyField] == keyValue){
			sum ++;
		}
	}
	return sum;
}

var make_bar_chart = function (donnees,couleurs,labels,container_id,div_id,titre) {
	
	//Les variables
	var w = 550;
	var h = 150;
	var bar_spacing = 15;
	var scalling_factor = 10;
	var padding = 25;
	var y_domain=d3.max(donnees)+1;
	var nb_tick=y_domain;
	if(y_domain >= 6){
		nb_tick=6;
	}
	var bar_width = w / donnees.length - bar_spacing - padding;
	
	var container = d3.select(container_id);
	var title = container.append("p")
				.attr("class","graph_title")
				.attr("id",div_id+"_title");
	
	//Les echelles
	var x_axisScale = d3.scale.ordinal()
						.domain(labels)
						.rangeBands([padding,w+padding]);
	
	var y_axisScale = d3.scale.linear()
						.domain([0,y_domain])
						.range([h-padding,0+(padding/2)]);
									
	//Le graphique
	
	var canvas = d3.select(div_id)
					.append("svg")
					.attr("width",w)
					.attr("height",h);
	
	//Les barres
	
	canvas.selectAll("rect")
			.data(donnees)
			.enter()
			.append("rect")
			.attr("width", bar_width)
			.attr("height",function(d){ 
				return y_axisScale(0) - y_axisScale(d);
			})
			.attr("y", function(d) {
				return y_axisScale(d);
			})
			.attr("x",function(d,i){ 
				return i * (w / donnees.length) + padding + bar_spacing;
			});
			
	canvas.selectAll("rect")
			.data(couleurs)
			.attr("fill", function(d){return d});
			
	//Les labels
	
	canvas.selectAll("text")
			.data(donnees)
			.enter()
			.append("text")
			.text(function(d) {
		 		return d;
			})
			.attr("x", function(d, i) {
			   return i * (w / donnees.length) + bar_width/2 + padding + bar_spacing;
			})
			.attr("y", function(d) {
					return y_axisScale(d) - 2;
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "12px")
			.attr("fill", "black");
	
	//Les Axes
    			
	var xAxis = d3.svg.axis()
					.scale(x_axisScale)
					.orient("bottom")
					.outerTickSize(0)
					.ticks(0);
					
	canvas.append("g")
			.attr("class","x_axis")
			.attr("transform", "translate(0,"+ (h - padding) +")")
			.call(xAxis);
								
	
	var yAxis = d3.svg.axis()
					.scale(y_axisScale)
					.orient("left")
					.outerTickSize(0)
					.ticks(nb_tick);
			
	canvas.append("g")
			.attr("class","y_axis")
			.attr("transform", "translate("+padding+",0)")
			.call(yAxis);
			
	title.text(titre);
}

var make_pie_chart = function(donnees,couleurs,container_id,div_id,titre) {
	
	var container = d3.select(container_id);

	//Diagrame circulaire http://jsfiddle.net/ragingsquirrel3/qkHK6/
	var w = 320;
	var h = 300;
	var r = h/2;
	var color = couleurs;

	var pie_data = donnees;

	var vis = d3.select(div_id).append("svg:svg").data([pie_data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
	var pie = d3.layout.pie().value(function(d){return d.value;});

	// declare an arc generator function
	var arc = d3.svg.arc().outerRadius(r);

	// select paths, use arc generator to draw
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
	arcs.append("svg:path")
		.attr("fill", function(d, i){
			return color[i];
		})
		.attr("d", function (d) {
			// log the result of the arc generator to show how cool it is :)
			console.log(arc(d));
			return arc(d);
		})
	// add the text
	arcs.append("svg:text")
		.attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
			return "translate(" + arc.centroid(d) + ")";
		})
		.attr("text-anchor", "middle")
		.text( function(d, i) {
			return pie_data[i].indice;
		});

	var legend = d3.select(container_id)
				.append("svg")
				.attr("class", "legend")
				.attr("width", 200)
				.attr("height", 50)
				.selectAll("g")
				.data(pie_data)
				.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", function(d, i) { return color[i]; });

	legend.append("text")
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function(d) { return d.label; });
	
	var title = container.append("p")
				.attr("class","graph_title")
				.attr("id",div_id+"_title")
				.text(titre);

}

d3.json("data.json", function(error, data) {

	//Les données
	var answers = [sumByKey(data,"property","right_answer"),sumByKey(data,"property","wrong_answer"),sumByKey(data,"property","skipped")];
	var colors = ["#53b60a","#e70000","grey"];
	var labels = ["Right answers", "Wrong answers", "Question skipped"];
	
	var RightPerCent=Math.round((100*answers[0])/(answers[0]+answers[1]));
	var WrongPerCent=Math.round((100*answers[1])/(answers[0]+answers[1]));
	
	
	var pie_donnees = [{"label":"Bonne réponse", "value":RightPerCent,"indice":RightPerCent+" %"}, 
						{"label":"Mauvaise réponse", "value":WrongPerCent,"indice":WrongPerCent+" %"}];
						
	make_bar_chart(answers,colors,labels,"#bar_chart","#bar_chart_1","Répartition des réponses pour Q1");
	make_pie_chart(pie_donnees,colors,"#pie_chart","#pie_chart_1","Répartition générale des réponses au quizz");
	
})
