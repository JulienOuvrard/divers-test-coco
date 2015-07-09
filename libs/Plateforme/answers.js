TestsCoco.Simulator.Answers = function(){
    var tool = new TestsCoco.Tools();
    this.dayInMillisecond = 86400000;
    this.answer_rate = 0.7;
    this.regular_day_rate = 1;
    this.random_day_rate = tool.pickRandomNumber(1,3);
};

TestsCoco.Simulator.Answers.prototype.getSessionDates = function(start,profile,nb_tours) {
    var _this = this;
    var session_dates = [];
    var d = start;
    for(var i = 0; i < nb_tours; i++){
        switch(profile) {
            case "regular":
                d.setTime(d.getTime() + _this.regular_day_rate * _this.dayInMillisecond);
                break;
            case "random":
                d.setTime(d.getTime() + _this.random_day_rate * _this.dayInMillisecond);
                break;
            default:
                console.log('Profile not implemented');
        }
        session_dates.push(d);
    }
    return session_dates;
}

TestsCoco.Simulator.Answers.prototype.dates = function (session_start,question,profile){
    var d = session_start.getTime(), d2;
    switch(profile) {
        case "regular":
            d += question.begin;
            break;
        case "random":
            d += question.begin;
            break;
        default:
            console.log('Profile not implemented');
    }
    d2 = new Date(d);
    return d2.toISOString();
}

TestsCoco.Simulator.Answers.prototype.generateAnswer = function (q,user_name,user_profile,session_start){
    var tool = new TestsCoco.Tools();
    var ret = {};
    ret.username = user_name;
    ret.subject = q.id;
    ret.date = this.dates(session_start,q,user_profile);
    var pickAns = Math.random() >= this.answer_rate ? true : false;
    if(!pickAns){
        ret.property = "skipped_answer";
        ret.value = 0;
    }else{
        var ansNumber = tool.pickRandomNumber(0,Object.keys(q.content.answers).length);
        ret.value = ansNumber;
        if(q.content.answers[ansNumber].correct){
            ret.property = "right_answer";
        }else{
            ret.property = "wrong_answer";
        }
    }
    return ret;
}

TestsCoco.Simulator.Answers.prototype.generateVote = function (q,user_name,user_profile,session_start){
    var retour;
    var tool = new TestsCoco.Tools();
    var vote = {};
    vote.username = user_name;
    vote.subject = q.id;
    vote.date = this.dates(session_start,q,user_profile);
    
    var ans = this.generateAnswer(q,user_name,user_profile,session_start);
    
    if(ans.property != "skipped_answer"){
        var pickVote = tool.pickRandomNumber(-1,2);
        vote.value = pickVote;
        switch (pickVote) {
            case -1:
                vote.property = "useless";
                break;
            case 0:
                vote.property = "skipped_vote";
                break;
            case 1:
                vote.property = "usefull";
                break;
        }
        retour = [ans,vote];
    }else{
        retour = [ans];
    }
    
    return retour;
}

TestsCoco.Simulator.Answers.prototype.generate = function (questions,numberOfQuestions,user_name,user_profile,session_start){
    var reponses = [];
    var _this = this;
    var tool = new TestsCoco.Tools();
    //Générer SessionId
    for(var k = 0 ; k < numberOfQuestions; k++){
        var idx = tool.pickRandomNumber(0,questions.length);
        reponses = reponses.concat(_this.generateVote(questions[idx],user_name,user_profile,session_start));
    }
    return reponses;
}

TestsCoco.Simulator.Answers.prototype.main = function (d1,numberOfQuestions,user,other,nb_tours){
    var _this = this;
    var tool = new TestsCoco.Tools();
    var ret = [];
    var s_dates = this.getSessionDates(new Date(),user.profile,nb_tours);
    //Générer SessionId
    for(var i = 0; i < nb_tours; i++){
        ret = ret.concat(_this.generate(d1.annotations,numberOfQuestions,user.name,user.profile,s_dates[i]));
    }
    return ret;
}
