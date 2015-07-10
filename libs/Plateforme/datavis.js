TestsCoco.DataVis = function(){};

TestsCoco.DataVis.prototype.main = function(container,questions,answers){
    var ann = questions.annotations;
    var ret = _.pluck(_.takeRightWhile(ann, 'type', 'Quizz'), 'begin');
    //console.table(ret);
    var m = _.max(ann,'begin');
    //console.log(m.begin);
}
