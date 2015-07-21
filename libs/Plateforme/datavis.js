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
            var time = value.begin;
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
            ret[q_id]['time']=time;
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

TestsCoco.DataVis.prototype.dataForHisto = function(wantedData,tab_total,tab_user,tab_media){
    var _this = this;
    var ret = {};
    var sorted_total_data = _.mapValues(this.sortAndComplete(tab_total),function(val){
        return _this.getPercentages(val);
    });
    $.each(tab_user,function(index,value){
        ret[index]=[];
        var sorted_session_data = _this.sortAndComplete(value)
        $.each(sorted_session_data,function(s_index,s_value){
            var data = {};
            data['key']=s_index;
            data['values']=[];
            $.each(s_value,function(prop_index,prop_value){
                if(prop_index.match(_this.makeRegExp(wantedData)) != null){
                    var prop = {};
                    var val;
                    prop['label']=_this.modifyLabel(prop_index);
                    prop['value']=prop_value;
                    prop['color']='blue';
                    data['values'].push(prop);
                }
            });
            var total_data = sorted_total_data[tab_media[s_index]];
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

TestsCoco.DataVis.prototype.getMedia = function(medias,subject){
    var ret;
    $.each(medias,function(index,value){
        $.each(value,function(i,v){
            if(v.id == subject ){
                ret = index;
            }
        });
    });
    return ret;
}

TestsCoco.DataVis.prototype.getGeneralAverage = function(medias,answers){
    var _this = this;
    var ret = {};
    var answered_questions = _.groupBy(answers,'subject');
    $.each(medias,function(index,value){
        var q_vid = _.keys(_.groupBy(value,'id'));
        var moyenne = {};
        $.each(answered_questions,function(q_index,q_value){
            if($.inArray(q_index,q_vid) != -1){
                var prop = _.groupBy(q_value,'property');
                var right = prop.right_answer ? prop.right_answer.length : 0;
                var wrong = prop.wrong_answer ? prop.wrong_answer.length : 0; 
                moyenne[q_index] = right * 100 / (right + wrong);
            }
        });
        var moyenne_generale = _.sum(moyenne)/(_.keys(moyenne).length);
        ret[index] = moyenne_generale;
    });
    return ret;
}

TestsCoco.DataVis.prototype.getUsersAverage = function(medias,answers){
    var _this = this;
    var ret = {};
    var us = _.groupBy(answers,'username');
    $.each(us,function(index,value){
        ret[index]={};
        var sessions = _.groupBy(value,'sessionId');
        $.each(sessions, function(s_index,s_value){
            var med = _this.getMedia(medias,s_value[0].subject);
            var prop = _.groupBy(s_value,'property');
            var right = prop.right_answer ? prop.right_answer.length : 0;
            var wrong = prop.wrong_answer ? prop.wrong_answer.length : 0; 
            ret[index][med] = right * 100 / (right + wrong);
        });
    });
    return ret;
}

TestsCoco.DataVis.prototype.dataForBullet = function (userAverage, generalAverage){

    var ret = {},
        title = "Moyenne",
        ranges = [0,50,100],
        markerLabels = ['Moyenne générale'],
        measureLabels = ['Moyenne étudiant'];

    $.each(userAverage,function(index,value){
        ret[index]=[];
        $.each(value,function(media_index,media_value){
            var obj = {};
            obj.title = title;
            obj.subtitle = media_index;
            obj.ranges =  ranges;
            obj.measures = [media_value];
            obj.markers = [generalAverage[media_index]];
            obj.markerLabels = markerLabels;
            obj.measureLabels = measureLabels;
            ret[index].push(obj)
        });
    });
    
    return ret;
    
}

TestsCoco.DataVis.prototype.makeBulletChart = function(data,container){
    var width = 760,
        height = 80,
        margin = {top: 5, right: 40, bottom: 20, left: 120};

    var chart = nv.models.bulletChart()
            .width(width - margin.right - margin.left)
            .height(height - margin.top - margin.bottom);
            
    var vis = d3.select("#"+container).selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("class", "bullet nvd3")
        .attr("width", width)
        .attr("height", height);

    vis.transition().duration(1000).call(chart);
    
    return vis;
}

TestsCoco.DataVis.prototype.getMediaInfo = function(media_id){
    var times = _.pluck(_.filter(_.values(this.medias[media_id]), 'type', 'Quizz'), 'begin');
    var max_time = _.max(times);
    return {'times':times,'max_time':max_time};
}

TestsCoco.DataVis.prototype.getPropertiesByQuestionByMedia = function(){
    var _this = this;
    
    var questionByMedia = _.mapValues(this.medias,function(value){
        return _.keys(_.groupBy(value,'id'));
    });
    
    var mapped = _.mapValues(questionByMedia,function(value){
        return _.mapKeys(value,function(val,key){
            return val;
        });
    });
    
    return ret = _.mapValues(mapped,function(value){
        return _.mapValues(value,function(val){
            return _this.propertiesByQuestion[val];
        });
    });
}

TestsCoco.DataVis.prototype.getPropertiesByMedia = function(){
    return _.mapValues(this.getPropertiesByQuestionByMedia(),function(value){
            var right = 0,
                wrong = 0,
                skip_a = 0,
                usefull = 0,
                useless = 0,
                skip_v = 0;
            $.each(value,function(q_index,q_value){
                right += q_value.right_answer ? q_value.right_answer : 0;
                wrong += q_value.wrong_answer ? q_value.wrong_answer : 0;
                skip_a += q_value.skipped_answer ? q_value.skipped_answer : 0;
                usefull += q_value.usefull ? q_value.usefull : 0;
                useless += q_value.useless ? q_value.useless : 0;
                skip_v += q_value.skipped_vote ? q_value.skipped_vote : 0;
            });
            return {
                'right_answer':right,
                'wrong_answer':wrong,
                'skipped_answer':skip_a,
                'usefull':usefull,
                'useless':useless,
                'skipped_vote':skip_v,
            };
        });
}

TestsCoco.DataVis.prototype.getMediaBySession = function(){
    
    var sub_bySession = _.mapValues(this.sessions,function(value){
        return value[0].subject;
    });
    
    var q_byMed = _.mapValues(this.getPropertiesByQuestionByMedia(),function(val){
        return _.keys(val);
    });
    
    return _.mapValues(sub_bySession,function(value){
        var ret;
        $.each(q_byMed,function(idx,val){
            if($.inArray(value,val) != -1){
                ret = idx;
            }
        });
        return ret;
    });
}

TestsCoco.DataVis.prototype.getPercentages = function(obj){
    obj.right_answer = obj.right_answer * 100 / (obj.right_answer + obj.wrong_answer);
    obj.wrong_answer = obj.wrong_answer * 100 / (obj.right_answer + obj.wrong_answer);
    obj.skipped_answer = obj.skipped_answer * 100 / (obj.right_answer + obj.wrong_answer + obj.skipped_answer);
    obj.usefull = obj.usefull * 100 / (obj.usefull + obj.useless);
    obj.useless = obj.useless * 100 / (obj.usefull + obj.useless);
    obj.skipped_vote = obj.skipped_vote * 100 / (obj.usefull + obj.useless + obj.skipped_vote);
    return obj;
}

TestsCoco.DataVis.prototype.getAllData = function (questions,answers) {
    this.ann = questions.annotations;

    this.medias = _.groupBy(this.ann,'media');
    
    this.sessions = _.groupBy(answers,'sessionId');
    //par média ex : m20131010
    this.getMediaInfo('m20131010');
    
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
    this.data_Histo_answer = this.dataForHisto(['right_answer','wrong_answer','skipped_answer'],this.getPropertiesByMedia(),this.propertiesBySessionByUser,this.getMediaBySession());
    this.data_Histo_vote = this.dataForHisto(['usefull','useless','skipped_vote'],this.getPropertiesByMedia(),this.propertiesBySessionByUser,this.getMediaBySession());
    this.data_Bullet = this.dataForBullet(this.getUsersAverage(this.medias,answers),this.getGeneralAverage(this.medias,answers));
    
    /** Data For Teacher **/
    this.data_Scatter = this.dataForScatter(this.propertiesByQuestion);
    this.data_Histo_ans_total = this.dataForHisto_Answers(this.NbAnswerByQuestion,this.getInfoQuestions(questions));
    
    
    console.log(this.propertiesBySessionByUser);
    //console.log(this.getPropertiesByMedia());
    var _this = this;
    console.log(_.mapValues(this.propertiesBySessionByUser['Alfred'],function(val){
        return _this.getPercentages(val);
        }));

}

TestsCoco.DataVis.prototype.generateGraphStudent = function(username,session_number){
    
    this.makeHistogram(this.data_Histo_answer[username][session_number],'bonneMauvaiseSkip','Nombre de réponses');
    
    this.makeHistogram(this.data_Histo_vote[username][session_number],'utilePasUtile','Votes');
    
    this.makeLineGraph(this.data_Line[username],'progEtu1');

    this.makeBulletChart(this.data_Bullet[username],'bulletChartAllStudents');
}

TestsCoco.DataVis.prototype.generateGraphTeacher = function(){
    
    this.makeScatterGraph(this.data_Scatter,'repUtile');
    
    this.makeSparkLine(this.data_Line,'table_spark');


}

TestsCoco.DataVis.prototype.generateAnswerDetails = function (question_id){
    this.makeHistogram(this.data_Histo_ans_total[question_id],'voteParRep','Nombre de réponses');
}

TestsCoco.DataVis.prototype.main = function(questions,answers,type){

    this.getAllData(questions,answers);
    if(type=='student'){
        this.generateGraphStudent('Alfred',5);
    }
    else if(type=='teacher'){
        this.generateGraphTeacher();
    }
    else{ this.generateAnswerDetails('8f5146de-9424-4c0f-9fdd-3e18dc8c93c7');
   }
   
}
