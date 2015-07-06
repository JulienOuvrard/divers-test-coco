function pickRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function downloadJson(data_to_dl,container,texte,filename){
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data_to_dl, null, 4));

    $('<a href="data:' + data + '" download="'+filename+'.json">'+texte+'</a>').appendTo(container);
}

function generateAnswer(q,user_name){
    console.log(q);
    var ret = {};
    ret.username = user_name;
    ret.subject = q.id;
    var pickAns = Math.random() >= 0.5 ? true : false;
    if(!pickAns){
        ret.property = "skipped_answer";
        ret.value = 0;
    }else{
        var ansNumber = pickRandomNumber(0,Object.keys(q.content.answers).length);
        ret.value = ansNumber;
        if(q.content.answers[ansNumber].correct){
            ret.property = "right_answer";
        }else{
            ret.property = "wrong_answer";
        }
    }
    return ret;
}

function generateVote(q,user_name){
    var retour;
    var vote = {};
    vote.username = user_name;
    vote.subject = q.id;
    
    var ans = generateAnswer(q,user_name);
    
    if(ans.property != "skipped_answer"){
        var pickVote = pickRandomNumber(-1,1);
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

function generate(questions,user_name){
    var reponses = []
    $.each(questions,function(index,value){
        reponses = reponses.concat(generateVote(value,user_name));
    });
    return reponses
}

function main(d1,d2){
    var ret = generate(d1[0].annotations,"roger");
    ret =  ret.concat(generate(d1[0].annotations,"michel"));
    downloadJson(ret,'#ans','Télécharger les réponses du 1er jeu de donnees','answers');
    
    var ret2 = generate(d2[0].annotations,"roger");
    ret2 =  ret2.concat(generate(d2[0].annotations,"michel"));
    downloadJson(ret2,'#ans2','Télécharger les réponses du second jeu de donnees','answers2');
}

$.when($.get("questions.json"), $.get("questions2.json"))
    .done(function(data,data2){
        main(data,data2);
        }
    );
