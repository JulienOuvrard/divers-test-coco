TestsCoco.Simulator.Answers = function(){
    var tool = new TestsCoco.Tools();
    this.dayInMillisecond = 86400000;
    this.hourInMillisecond = 3600000;
    this.minuteInMillisecond = 60000;
    this.answer_rate = 0.7;
};

TestsCoco.Simulator.Answers.prototype.dates = function (session_start,question,profile){
    var d = session_start.getTime(), d2;
    switch(profile) {
        case "regular":
            d += question.begin;
            break;
        case "random":
            d += _.random(question.begin,question.end);
            break;
        default:
            console.log('Profile not implemented');
    }
    d2 = new Date(d);
    return d2.toISOString();
}

TestsCoco.Simulator.Answers.prototype.generateAnswer = function (q,user_name,user_profile,session_start,session_id){
    var tool = new TestsCoco.Tools();
    var ret = {};
    ret.username = user_name;
    ret.subject = q.id;
    ret.date = this.dates(session_start,q,user_profile);
    ret.sessionId = session_id;
    var pickAns = Math.random() < this.answer_rate ? true : false;
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

TestsCoco.Simulator.Answers.prototype.generateVote = function (q,user_name,user_profile,session_start,session_id){
    var retour;
    var tool = new TestsCoco.Tools();
    var vote = {};
    vote.username = user_name;
    vote.subject = q.id;
    vote.date = this.dates(session_start,q,user_profile);
    vote.sessionId = session_id;
    
    var ans = this.generateAnswer(q,user_name,user_profile,session_start,session_id);
    
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

TestsCoco.Simulator.Answers.prototype.generate = function (questions,numberOfQuestions,user_name,user_profile,session_start,session_id){
    var reponses = [];
    var _this = this;
    var tool = new TestsCoco.Tools();
    
    $.each(questions,function(index,value){
        reponses = reponses.concat(_this.generateVote(value,user_name,user_profile,session_start,session_id));
    });
    return reponses;
}

TestsCoco.Simulator.Answers.prototype.main = function (d1,numberOfQuestions,user){
    var _this = this;
    var tool = new TestsCoco.Tools();
    var ret = [];

    $.each(user.session_dates,function(index,value){
        var session_id = tool.generateUid();
        ret = ret.concat(_this.generate(d1.annotations,numberOfQuestions,user.name,user.profile,value,session_id));
    });
    
    return ret;
}
