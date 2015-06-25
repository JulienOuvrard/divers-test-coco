
d3.json("data.json", function(error, data) {

var sumByKey = function(array, keyField, keyValue){
	var sum = 0;
	for(var i=0, len=array.length; i<len; i++){
		if(array[i][keyField] == keyValue){
			sum ++;
		}
	}
	return sum;
}	
	var sum_date= function(array){
		
		var dates=new Array;
		var retour=new Array;
		
		for(var i=0, len=array.length; i<len; i++) {
			var jour={};
			var x = array[i]["date"].substring(0,array[i]["date"].indexOf("T",0));
			jour.date=x
			dates[i]=jour;
		}
		var k=0;
		
		dates.forEach(function(obj){
			var j={};
			j.date=obj.date;
			j.nb_user=sumByKey(dates,"date",obj.date);
			retour[k]=j;
			k++;
		});
		
		return retour;
	}
				
				
var time =  function(array, keyField){
				var sum=new Array;
				for(var i=0, len=array.length; i<len; i++) {
					if(array[i][keyField] != 0){
						sum[i]= array[i][keyField].substring(0,array[i][keyField].indexOf("T",0));
					}
					return sum;
				}
			}	
				
//var answer = time(data,"date");
var donnes = sum_date(data);
//alert(answer);
console.log(donnes);
/*			
var data = [{"date":answer[0],"total":13},{"date":answer[1],"total":8},{"date":answer[2],"total":2},{"date":answer[3],"total":10},{"date":answer[4],"total":3},{"date":answer[5],"total":20},{"date":answer[6],"total":12}];

var margin = {top: 40, right: 40, bottom: 40, left:40},
    width = 600,
    height = 500;

var x = d3.time.scale()
    .domain([new Date(data[0].date), d3.time.month.offset(new Date(data[data.length - 1].date), 10)])
    .rangeRound([0, width - margin.left - margin.right]);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.total; })])
    .range([height - margin.top - margin.bottom, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.month, 1)
    .tickFormat(d3.time.format('%b'))
    .tickSize(0)
    .tickPadding(8);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickPadding(8);

var svg = d3.select('body').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

svg.selectAll('.chart')
    .data(data)
  .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) { return x(new Date(d.date)); })
    .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.total)) })
    .attr('width', 10)
    .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.total) });

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
    .call(xAxis);

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);
*/
})
