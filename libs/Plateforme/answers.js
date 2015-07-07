TestsCoco.Simulator.Answers = function(){};

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
    var pickAns = Math.random() >= 0.5 ? true : false;
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
        var pickVote = tool.pickRandomNumber(-1,1);
        vote.value = pickVote;
        switch (pickVote) {
            case -1:
                vote.property = "useless";
                break;
            case 0:
                vote.property = "skipped_vote";
                break;
            case 1:
                vote.property = "useless";
                break;
        }
        retour = [ans,vote];
    }else{
        retour = [ans];
    }
    
    return retour;
}

TestsCoco.Simulator.Answers.prototype.generate = function (questions,user_name,user_profile,session_start){
    var reponses = [];
    var _this = this;
    $.each(questions,function(index,value){
        reponses = reponses.concat(_this.generateVote(value,user_name,user_profile,session_start));
    });
    return reponses;
}

TestsCoco.Simulator.Answers.prototype.main = function (d1,other){
    var tool = new TestsCoco.Tools();
    var ret = this.generate(d1.annotations,"roger","regular",new Date());
    ret =  ret.concat(this.generate(d1.annotations,"michel","random",new Date()));
    return ret;
}