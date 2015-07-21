TestsCoco.DataVis = function(container){
        this.container = container;
};

TestsCoco.DataVis.prototype.sortAndComplete = function (tab) {
    var order = ['right_answer','wrong_answer','skipped_answer','usefull','useless','skipped_vote'];
    return _.mapValues(tab,function(value){
        var obj = {};
        order.forEach(function(elem){
            obj[elem] = (value[elem]===undefined) ? 0 : value[elem];
        });
        return obj;
    });
}

TestsCoco.DataVis.prototype.getSessionDate = function(tab){
    var group = _.groupBy(tab,'sessionId');
    return _.mapValues(group,function(value){
        return _.first(value).date;
    });
}

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

TestsCoco.DataVis.prototype.getInfoQuestions = function(tab){
    
    var ret = {};
    
    var ann = tab.annotations;

    $.each(ann,function(index,value){
        if(value.type === 'Quizz'){
            var q_id = value.id;
            var desc = value.content.description;
            var ans = value.content.answers;
            var correct =[];
            var content=[];
            $.each(ans,function(ans_index,ans_value){
                content.push(ans_value.content);
                correct.push(ans_value.correct);
            });
            ret[q_id]={};
            ret[q_id]['enonce']=desc;
            ret[q_id]['answers']=content;
            ret[q_id]['correct']=correct;
        }
    });
    
    return ret;
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

TestsCoco.DataVis.prototype.dataForHisto = function(wantedData,tab_total,tab_user,all){
    var _this = this;
    var ret = {};
    var sorted_total_data = this.sortAndComplete(tab_total);
    $.each(tab_user,function(index,value){
        ret[index]=[];
        var sorted_question_data = _this.sortAndComplete(value)
        $.each(sorted_question_data,function(q_index,q_value){
            var data = {};
            data['key']=q_index;
            data['values']=[];
            if(all){
            $.each(q_value,function(prop_index,prop_value){
                if(prop_index.match(_this.makeRegExp(wantedData)) != null){
                    var prop = {};
                    prop['label']=_this.modifyLabel(prop_index);
                    prop['value']=prop_value;
                    prop['color']='blue';
                    data['values'].push(prop);
                }
            });
            }
            var total_data = sorted_total_data[q_index];
            $.each(total_data,function(index2,value2){
                if(index2.match(_this.makeRegExp(wantedData)) != null){
                    var prop = {};
                    prop['label']='Total '+_this.modifyLabel(index2);
                    prop['value']=value2;
                    prop['color']='green';
                    data['values'].push(prop);
                }
            });
            
            ret[index].push([data]);
        });
    });
        
    return ret;
}

TestsCoco.DataVis.prototype.dataForHisto_Answers = function(tab,info_questions) {
    var ret = {};
    
    $.each(tab,function(index,value){
        ret[index]=[];
        var obj = {};
        obj['key'] = index;
        obj['values'] = [];
        var long = info_questions[index].answers.length;
        var correct = info_questions[index].correct;
        for(var i = 0 ; i < long ; i++){
            var ans = {};
            ans['label'] = (i+1);
            ans['value'] = (value[i] != undefined) ? value[i] : 0;
            ans['color'] = correct[i] ? 'green' : 'grey';
            obj['values'].push(ans);
        }
        ret[index].push(obj);
    });
    return ret;
}

TestsCoco.DataVis.prototype.makeHistogram = function(data,container,title){
    
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
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
}

TestsCoco.DataVis.prototype.dataForScatter = function(tab){
    var data = [];
    var ret = {};
    ret['values'] = [];
    var sorted_tab = this.sortAndComplete(tab);
    $.each(sorted_tab,function(index,value){
        var point = {};
        point['x'] = (value.usefull - value.useless) / (value.usefull + value.useless);
        point['y'] = (value.right_answer - value.wrong_answer) / (value.right_answer + value.wrong_answer);
        point['shape'] = 'circle';
        ret['values'].push(point);
    });
    data.push(ret);
    return data;
};

TestsCoco.DataVis.prototype.makeScatterGraph = function(data,container){
    
    if(document.getElementById(container) === null){
        $(this.container).append('<div id='+container+'><svg></svg></div>');
    }
    var selector = '#'+container+' svg';
    
    nv.addGraph(function() {
        var chart = nv.models.scatterChart()
            .xDomain([-1,1])
            .yDomain([-1,1])
            .showXAxis(true)
            .showYAxis(true)
            .useVoronoi(true)
            .color(d3.scale.category10().range())
            .duration(300);

        chart.xAxis.axisLabel('Utilité de la question');
        chart.yAxis.axisLabel('Justesse de la réponse');
        chart.xAxis.tickFormat(d3.format('.02f'));
        chart.yAxis.tickFormat(d3.format('.02f'));
        chart.xAxis.ticks(10);
        chart.yAxis.ticks(10);

        d3.select(selector)
            .datum(data)
            .call(chart);
            
            var lineX = d3.select(selector)
                            .append('line')
                            .attr({
                                x1: 75 + chart.xAxis.scale()(-1),
                                y1: 30 + chart.yAxis.scale()(0),
                                x2: 75 + chart.xAxis.scale()(1),
                                y2: 30 + chart.yAxis.scale()(0)
                            })
                            .style("stroke", "#000000");
            var lineY = d3.select(selector)
                            .append('line')
                            .attr({
                                x1: 75 + chart.xAxis.scale()(0),
                                y1: 30 + chart.yAxis.scale()(-1),
                                x2: 75 + chart.xAxis.scale()(0),
                                y2: 30 + chart.yAxis.scale()(1)
                            })
                            .style("stroke", "#000000");

        nv.utils.windowResize(chart.update);
        nv.utils.windowResize(function(){
            chart.update();
            lineX.attr({
                x1: 75 + chart.xAxis.scale()(-1),
                y1: 30 + chart.yAxis.scale()(0),
                x2: 75 + chart.xAxis.scale()(1),
                y2: 30 + chart.yAxis.scale()(0)
            }),
            lineY.attr({
                x1: 75 + chart.xAxis.scale()(0),
                y1: 30 + chart.yAxis.scale()(-1),
                x2: 75 + chart.xAxis.scale()(0),
                y2: 30 + chart.yAxis.scale()(1)
            })
            
        });
        return chart;  },function(){
          d3.selectAll(".nv-scatter").on('click',
               function(){
                     console.log("test");
           });
      });
}

TestsCoco.DataVis.prototype.dataForLineGraph = function(tab_date,tab_user){
    var _this = this;
    var ret = {}
    $.each(tab_user,function(index,value){
        ret[index]=[];
        var d = {};
        d['key']='Note';
        d['values']=[];
        $.each(_this.sortAndComplete(value),function(session_index,session_value){
            var moyenne = (session_value.right_answer * 100) / (session_value.right_answer + session_value.wrong_answer);
            var date = new Date (tab_date[session_index]);
            d['values'].push([date,moyenne]);
        });
        ret[index].push(d);
    });
    return ret;
}

TestsCoco.DataVis.prototype.makeLineGraph = function(data,container){
    
    if(document.getElementById(container) === null){
        $(this.container).append('<div id='+container+'><svg></svg></div>');
    }
    var selector = '#'+container+' svg';
    
    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .useInteractiveGuideline(false)
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] })
            .color(d3.scale.category10().range())
            .duration(300)
            .clipVoronoi(false);

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis.axisLabel('Date');
        chart.yAxis.axisLabel('Note');
        chart.xAxis.tickFormat(function(d) {
            return d3.time.format('%d/%m/%y')(new Date(d))
        });

        chart.yAxis.tickFormat(d3.format('1'));

        

        d3.select(selector)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

TestsCoco.DataVis.prototype.makeSparkLine = function(data,container){
    var users = _.keys(data);
    
    var str = '<tr><th>Nom</th><th>Courbe de progression</th><th>Moyenne de l\'élève</th><th>Indice de progression</th><th>Satisfaction</th></tr>';
    users.forEach(function(elem){
        str+='<tr><td>'+elem+'</td><td><svg id="chart_'+elem+'" class="sparkline"></svg></td><td id="average_'+elem+'"></td><td id="progression_'+elem+'"></td><td id="satisfaction_'+elem+'"></td></tr>';
    });
    $('#'+container).append(str);
    
    
    users.forEach(function(user){
        var chart_selector = '#chart_'+user,
            average_selector = '#average_'+user,
            progression_selector = '#progression_'+user,
            satisfaction_selector = '#satisfaction_'+user;
            
        nv.addGraph(function() {
            var chart = nv.models.sparklinePlus();
            chart.margin({left:70})
                .x(function(d) { return d[0] })
                .y(function(d) { return d[1] })
                .showLastValue(true)
                .xTickFormat(function(d) {
                    return d3.time.format('%d/%m/%y')(new Date(d))
                });

            d3.select(chart_selector)
                    .datum(data[user][0].values)
                    .call(chart);

            return chart;
        });
        
        var notes = [];
        data[user][0].values.forEach(function(note){
            notes.push(note[1]);
        });
        var average = _.round(_.sum(notes)/notes.length,2);
        $(average_selector).append(average);
        var satisfaction;
        switch(true){
            case (average < 8) : 
                satisfaction = 'pas bon';
                break;
            case (average < 10) :
                satisfaction = 'peut mieux faire';
                break;
            case (average < 12) :
                satisfaction = 'moyen';
                break;
            case (average < 14) :
                satisfaction = 'bien';
                break;
            default:
                satisfaction = 'très bien'
        }
        $(satisfaction_selector).append(satisfaction);
        
    })
}
TestsCoco.DataVis.prototype.combine = function(tab){
    var ret = [];
    $.each(tab,function(index,elem){
        var obj = {};
        obj['key']=index;
        obj['values']=elem[0].values;
        ret.push(obj);
    });
    return ret;
}

TestsCoco.DataVis.prototype.getAllData = function (questions,answers) {
    var ann = questions.annotations;

    this.max_time = _.max(ann,'begin');
        
    this.times = _.pluck(_.filter(ann, 'type', 'Quizz'), 'begin');
    
    this.properties_count = _.countBy(answers,'property');
    
    this.propertiesByQuestion = this.getPropertiesByKey(answers,'subject','property');
    this.propertiesBySession = this.getPropertiesByKey(answers,'sessionId','property');
    
    this.userBySession = this.getPropertiesByKey(answers,'sessionId','username');
    this.userByQuestion = this.getPropertiesByKey(answers,'subject','username');
    
    this.propertiesByUserByQuestion = this.aggregate(answers,'subject','username','property');
    this.propertiesByUserBySession = this.aggregate(answers,'sessionId','username','property');
    
    this.propertiesByQuestionByUser = this.aggregate(answers,'username','subject','property');
    this.propertiesBySessionByUser = this.aggregate(answers,'username','sessionId','property');
    
    this.NbAnswerByQuestion = this.getNbAnswerByQuestion(answers);
    
    this.session_date = this.getSessionDate(answers);
    
    /** Data For Both **/
    this.data_Line = this.dataForLineGraph(this.session_date,this.propertiesBySessionByUser);
    
    /** Data For Student **/
    this.data_Histo_answer = this.dataForHisto(['right_answer','wrong_answer','skipped_answer'],this.propertiesByQuestion,this.propertiesByQuestionByUser,true);
    this.data_Histo_vote = this.dataForHisto(['usefull','useless','skipped_vote'],this.propertiesByQuestion,this.propertiesByQuestionByUser);
    
    /** Data For Teacher **/
    this.data_Scatter = this.dataForScatter(this.propertiesByQuestion);
    this.data_Histo_ans_total = this.dataForHisto_Answers(this.NbAnswerByQuestion,this.getInfoQuestions(questions));
}

TestsCoco.DataVis.prototype.generateGraphStudent = function(username){
    
    this.makeHistogram(this.data_Histo_answer[username][1],'bonneMauvaiseSkip','Nombre de réponses');
    
    this.makeHistogram(this.data_Histo_vote[username][1],'utilePasUtile','Votes');
    
    this.makeLineGraph(this.data_Line[username],'progEtu1');

}

TestsCoco.DataVis.prototype.generateGraphTeacher = function(){
    
    this.makeScatterGraph(this.data_Scatter,'repUtile');
    
    this.makeSparkLine(this.data_Line,'table_spark');

    this.makeLineGraph(this.combine(this.data_Line),'histoAllStudents');

}

TestsCoco.DataVis.prototype.generateAnswerDetails = function (question_id){
    this.makeHistogram(this.data_Histo_ans_total[question_id],'voteParRep','Nombre de réponses');
}

TestsCoco.DataVis.prototype.main = function(questions,answers,type){
    
    this.getAllData(questions,answers);
    if(type=='student'){
        this.generateGraphStudent('Alfred');
    }
    else if(type=='teacher'){
        this.generateGraphTeacher();
    }
    else{ this.generateAnswerDetails('8f5146de-9424-4c0f-9fdd-3e18dc8c93c7');
   }
}
