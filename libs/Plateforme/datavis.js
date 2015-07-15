TestsCoco.DataVis = function(){};

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

TestsCoco.DataVis.prototype.main = function(container,questions,answers,users){
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
    
    var NbAnswerByQuestion = this.getNbAnswerByQuestion(answers);
    
    //console.table(propertiesByQuestion);
    //console.table(propertiesBySession);
    //console.table(propertiesByUserByQuestion);
    //console.table(NbAnswerByQuestion);
    
}
