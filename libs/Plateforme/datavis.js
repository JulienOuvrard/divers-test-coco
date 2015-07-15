TestsCoco.DataVis = function(container){
        this.container = container;
};

TestsCoco.DataVis.prototype.getPropertiesByKey = function(tab,key,key2) {
    var group = _.groupBy(tab,key);
    return _.mapValues(group,function(value){
        return _.countBy(value,key2);
    });
}

TestsCoco.DataVis.prototype.aggregate = function(tab,key1,key2,key3) {
    var group = _.groupBy(tab,key1);
    
    var groupByKey2 = _.mapValues(group,function(value){
        return _.groupBy(value,key2);
    });
    
    return _.mapValues(groupByKey2,function(value){
        return _.mapValues(value,function(value2){
            return _.countBy(value2,key3);
        });
    });
}

TestsCoco.DataVis.prototype.getNbAnswerByQuestion = function(tab){
    var obj = {};
    var valueByPropertyByQuestion = this.aggregate(tab,'subject','property','value');
    $.each(valueByPropertyByQuestion,function(index,value){
        obj[index] = {}
        $.each(value,function(index2,value2){
            if(index2.match(/right_answer|wrong_answer/gi) != null){
                $.each(value2,function(index3,value3){
                    obj[index][index3]=value3;
                });
            }
        });
    });
    return obj;
}
TestsCoco.DataVis.prototype.makeRegExp = function (tab){
    var str = '';
    $.each(tab,function(index,value){
        str+=value;
        if(index != (tab.length-1)){
            str+='|';
        }
    });
    return new RegExp(str,'gi');
}

TestsCoco.DataVis.prototype.modifyLabel = function(str){
    var lab= '';
    switch(str){
        case 'right_answer':
            lab = 'Bonne réponse';
            break;
        case 'wrong_answer':
            lab = 'Mauvaise réponse';
            break;
        case 'skipped_answer':
            lab = 'Réponse passée';
            break;
        case 'usefull':
            lab = 'Utile';
            break;
        case 'useless':
            lab = 'Inutile';
            break;
        case 'skipped_vote':
            lab = 'Vote passé';
            break;
    }
    return lab;
}

TestsCoco.DataVis.prototype.dataForHisto = function(wantedData,tab_user,tab_total){
    var _this = this;
    var ret = {};
    var args = arguments.length;
    $.each(tab_user,function(index,value){
        ret[index]=[];
        $.each(value,function(q_index,q_value){
            var data = {};
            data['key']=q_index;
            data['values']=[];
            $.each(q_value,function(prop_index,prop_value){
                if(prop_index.match(_this.makeRegExp(wantedData)) != null){
                    var prop = {};
                    prop['label']=_this.modifyLabel(prop_index);
                    prop['value']=prop_value;
                    prop['color']='blue';
                    data['values'].push(prop);
                }
            });

            if(args === 3){
                var total_data = tab_total[q_index];
                $.each(total_data,function(index2,value2){
                    if(index2.match(_this.makeRegExp(wantedData)) != null){
                        var prop = {};
                        prop['label']='Total '+_this.modifyLabel(index2);
                        prop['value']=value2;
                        prop['color']='green';
                        data['values'].push(prop);
                    }
                });
            }
            ret[index].push([data]);
        });
    });
        
    return ret;
}

TestsCoco.DataVis.prototype.makeHistogram = function(tab,container,title){
    
    if(document.getElementById(container) === null){
        $(this.container).append('<div id='+container+'><svg></svg></div>');
    }
    var selector = '#'+container+' svg';
    
    nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true)
            //.staggerLabels(historicalBarChart[0].values.length > 8)
            .showValues(true)
            .duration(250);
            
            
		chart.yAxis.axisLabel(title);

        d3.select(selector)
            .datum(tab)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
}

TestsCoco.DataVis.prototype.dataForScatter = function(tab){
    //par video
    //x = usefull, useless / total vote
    //y = right wrong / total answer
    var shapes = [ 'circle'];
    return [
        {
            "values": 
            [{
                "x": 1,
                "y": 1
            }, 
            {
            }]
        }
        ];
};

TestsCoco.DataVis.prototype.makeScatterGraph = function(data){
    nv.addGraph(function() {
        var chart = nv.models.scatterChart()
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

        d3.select('#test1 svg')
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

TestsCoco.DataVis.prototype.main = function(questions,answers){
    var ann = questions.annotations;

    var max_time = _.max(ann,'begin');
    //console.log(max_time.begin);
        
    var times = _.pluck(_.filter(ann, 'type', 'Quizz'), 'begin');
    //console.table(times);
    
    var properties_count = _.countBy(answers,'property');
    //console.log(properties_count);
    
    var propertiesByQuestion = this.getPropertiesByKey(answers,'subject','property');
    var propertiesBySession = this.getPropertiesByKey(answers,'sessionId','property');
    
    var userBySession = this.getPropertiesByKey(answers,'sessionId','username');
    var userByQuestion = this.getPropertiesByKey(answers,'subject','username');
    
    var propertiesByUserByQuestion = this.aggregate(answers,'subject','username','property');
    var propertiesByUserBySession = this.aggregate(answers,'sessionId','username','property');
    
    var propertiesByQuestionByUser = this.aggregate(answers,'username','subject','property');
        
    var NbAnswerByQuestion = this.getNbAnswerByQuestion(answers);
    
    console.table(propertiesByQuestion);
    //console.table(propertiesBySession);
    //console.table(propertiesByUserByQuestion);
    //console.table(NbAnswerByQuestion);
    
    var data_Histo_answer = this.dataForHisto(['right_answer','wrong_answer','skipped_answer'],propertiesByQuestionByUser,propertiesByQuestion);
    //console.log(data_Histo_answer);

    var data_Histo_vote = this.dataForHisto(['usefull','useless','skipped_vote'],propertiesByQuestionByUser);
    //console.log(data_Histo_vote);
    
    this.makeHistogram(data_Histo_answer['Alfred'][0],'chart1','Nombre de réponse');
    this.makeHistogram(data_Histo_answer['Alfred'][2],'chart2','Nombre de réponse');
    this.makeHistogram(data_Histo_answer['Alfred'][5],'chart3','Nombre de réponse');
    this.makeHistogram(data_Histo_answer['Alfred'][8],'chart4','Nombre de réponse');
    
    this.makeHistogram(data_Histo_vote['Alfred'][0],'chart5','Votes');
    this.makeHistogram(data_Histo_vote['Alfred'][2],'chart6','Votes');
    this.makeHistogram(data_Histo_vote['Alfred'][5],'chart7','Votes');
    this.makeHistogram(data_Histo_vote['Alfred'][8],'chart8','Votes');
    
}
