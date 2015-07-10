TestsCoco.DataVis = function(){};

TestsCoco.DataVis.prototype.getPropertiesByKey = function(tab,key,key2) {
    var answers_group = _.groupBy(tab,key);
    return _.mapValues(answers_group,function(value){
        return _.countBy(value,key2);
    });
}

TestsCoco.DataVis.prototype.decorate = function(tab) {
    //var mapped = this.getPropertiesByKey(tab,decor,'username');
    var user_group = _.groupBy(tab,'subject');
    var mapped = _.mapValues(user_group,function(value){
        return _.groupBy(value,'username');
    });
    var prop = _.mapValues(mapped,function(value){
        return _.mapValues(value,function(value2){
            return _.countBy(value2,'property');
        });
    });
    /*var prop = _.mapValues(tab,function(value){
        return _.mapValues(value,function(value2){
            return _.countBy(value2,decor);
        });
    });*/
    return prop;
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
    console.table(propertiesByQuestion);
    //console.table(propertiesBySession);
    console.table(this.decorate(answers));
    //console.table(this.decorate(answers,'subject'));
    //console.table(this.decorate(userBySession,'property'));
}
