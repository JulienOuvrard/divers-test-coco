function getSessionByMedia(medias,sessions){
    var questionByMedia = _.mapValues(medias,function(value){
        return _.keys(_.groupBy(value,'id'));
    });
    
    var questionBySession = _.mapValues(sessions,function(val){
        return _.keys(_.groupBy(val,'subject'));
    });
    var ret2 = _.mapValues(questionByMedia,function(value){
        var ret=[];
        value.forEach(function(q_val){
            $.each(questionBySession,function(idx,val){
                if($.inArray(q_val,val) != -1){
                    ret.push(idx);
                }
            });
        });
        return _.uniq(ret);
    });
    
    return ret2;
}

function getInfoQuestions(annotations){
    
    var ret = {};

    $.each(annotations,function(index,value){
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
function aggregate (tab,key1,key2,key3) {
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

function sortAndComplete (tab) {
    var order = ['right_answer','wrong_answer','skipped_answer','usefull','useless','skipped_vote'];
    return _.mapValues(tab,function(value){
        var obj = {};
        order.forEach(function(elem){
            obj[elem] = (value[elem]===undefined) ? 0 : value[elem];
        });
        return obj;
    });
}
function getSessionDate (tab){
    var group = _.groupBy(tab,'sessionId');
    return _.mapValues(group,function(value){
        return _.first(value).date;
    });
}

function getData (sessionByMedia,properties,infos,sessionDates){
    var ret = {};
    $.each(sessionByMedia,function(med_id,med_val){
        ret[med_id]=[];
        var temp = {};
        temp['key'] = 'utilité';
        temp['values'] = [];
        $.each(med_val,function(s_idx,s_val){
            var sorted_question_tab = sortAndComplete(properties[s_val]);
            $.each(sorted_question_tab,function(q_idx,q_val){
                var point = {};
                point['y'] = sessionDates[s_val];
                point['shape'] = 'circle';
                var utility = (q_val.usefull + q_val.useless) == 0 ? 0 : (q_val.usefull - q_val.useless) / (q_val.usefull + q_val.useless);
                var color = (utility > 0) ? 'green' : 'red';
                point['x'] = infos[q_idx].time;
                point['color'] = color;
                temp['values'].push(point);
            });
        });
        ret[med_id].push(temp);
    });
    return ret;
}

function makeScatterGraph (data,mediaInfo,container){
    if(document.getElementById(container) === null){
        $('.analytics').append('<div id='+container+'><svg></svg></div>');
    }
    var selector = '#'+container+' svg';
    
    nv.addGraph(function() {
        var chart = nv.models.scatterChart()
            .xDomain([0,mediaInfo.max_time])
            .yDomain([-1,1])
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .color(d3.scale.category10().range())
            .duration(300);

        chart.xAxis.axisLabel('Temps Video');
        chart.yAxis.axisLabel('Temps');
        chart.xAxis.tickFormat(function(d) {
            return d3.time.format('%X')(new Date(d+ new Date(2015,7,22,0,0).getTime()))
        });
        chart.yAxis.tickFormat(function(d) {
            return d3.time.format('%d/%m/%y')(new Date(d))
        });
        
        
        d3.select(selector)
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
}

function getMediaInfo (medias,media_id){
    var begin_times = _.pluck(_.filter(_.values(medias[media_id]), 'type', 'Quizz'), 'begin');
    var end_times = _.pluck(_.filter(_.values(medias[media_id]), 'type', 'Quizz'), 'end');
    var max_time = _.max(end_times);
    return {'times':begin_times,'max_time':max_time};
}

function main(){
    $.when($.get("../Donnees_tests/analytics_data/questions_3files.json"),
            $.get("../Donnees_tests/analytics_data/answers_3files.json"))
        .done(function(data1,data2){
                var medias = _.groupBy(data1[0].annotations,'media');
                var sessions = _.groupBy(data2[0],'sessionId');
                var sessionByMedia = getSessionByMedia(medias,sessions);
                var infoQuestion = getInfoQuestions(data1[0].annotations);
                var sessionDates = getSessionDate(data2[0]);
                
                var propertiesByQuestionBySession = aggregate(data2[0],'sessionId','subject','property');
                
                var data = getData(sessionByMedia,propertiesByQuestionBySession,infoQuestion,sessionDates);
                console.log(data);
                $.each(medias,function(med_id,med_val){
                    var container = 'graph_'+med_id;
                    makeScatterGraph(data[med_id],getMediaInfo(medias,med_id),container);
                });
            }
        );
}

main();
