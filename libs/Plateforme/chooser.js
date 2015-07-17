TestsCoco.Simulator.Chooser = function(){};

TestsCoco.Simulator.Chooser.prototype.countOccurences = function (tab_ans,tab_quest){
 
    var ann = tab_quest.annotations;
    
    var shown_properties = ["right_answer","wrong_answer","skipped_answer"];
    var votted_properties = ["usefull","useless","skipped_vote"];
    
    var shown = {};
    var votted = {};
    var positive_vote = {};
    
    tab_ans.forEach(function(elem){
        if(jQuery.inArray(elem.property,shown_properties) != -1){
            if(elem.subject in shown){
                shown[elem.subject] = ++shown[elem.subject];
            }
            else{
                shown[elem.subject] = 1;
            }
        }
        if(jQuery.inArray(elem.property,votted_properties) != -1){
            if(elem.subject in votted){
                votted[elem.subject] = ++votted[elem.subject];
            }
            else{
                votted[elem.subject] = 1;
            }
        }
        if(elem.property=="usefull"){
            if(elem.subject in positive_vote){
                positive_vote[elem.subject] = ++positive_vote[elem.subject];
            }
            else{
                positive_vote[elem.subject] = 1;
            }
        }
    });
    
    ann.forEach(function(elem){
        if(jQuery.inArray(elem.id,Object.keys(shown)) == -1){
            shown[elem.id] = 0;
        }
        if(jQuery.inArray(elem.id,Object.keys(votted)) == -1){
            votted[elem.id] = 0;
        }
        if(jQuery.inArray(elem.id,Object.keys(positive_vote)) == -1){
            positive_vote[elem.id] = 0;
        }
    });
    
    return {"shown":shown,"votted":votted,"positive_vote":positive_vote};
}

TestsCoco.Simulator.Chooser.prototype.percentage = function (tab1,tab2){
    var result = {};
    $.each(tab2, function(index, value) {
        if(!tab1[index]){
            result[index]=0;
        }else{
            result[index]=tab1[index] / value;
        }
    });
    return result;
}

TestsCoco.Simulator.Chooser.prototype.getTime = function (tab){
    var ret={};
    var ann = tab.annotations;
    ann.forEach(function(elem){
        if(elem.type == "Quizz"){
            ret[elem.id] = elem.begin;
        }
    });
    return ret;
}

TestsCoco.Simulator.Chooser.prototype.getEnonce = function (tab){
    var ret={};
    var ann = tab.annotations;
    ann.forEach(function(elem){
        if(elem.type == "Quizz"){
            ret[elem.id] = elem.content.description;
        }
    });
    return ret;
}

TestsCoco.Simulator.Chooser.prototype.positive = function (tab){
    var votted_properties = ["usefull","useless","skipped_vote"];
    var res={};
    tab.forEach(function(elem){
        if($.inArray(elem.property,votted_properties) != -1){
             if(elem.subject in res){
                 res[elem.subject] += elem.value;
             }else {
                 res[elem.subject] = 0;
             }
        }
    });
    return res;
}


TestsCoco.Simulator.Chooser.prototype.syntax_similarity = function (phrase1,phrase2){
    var tool =  new TestsCoco.Tools();
    natural.PorterStemmerFr.attach();
    p1=phrase1.tokenizeAndStem();
    p2=phrase2.tokenizeAndStem();

    var words=tool.arrayUnique(p1.concat(p2));


    var TfIdf = natural.TfIdf, tfidf = new TfIdf();
    tfidf.addDocument(p1);
    tfidf.addDocument(p2);
    var t1 =[];
    
    var j = 0;
    words.forEach(function(elem){
        var temp = [];
        tfidf.tfidfs(elem, function(i, measure) {
            temp[i]=measure;
        });
        t1[j]=temp;
        ++j;
    })
    
    var t2 = tool.transpose(t1);
    
    return tool.cosine(t2[0],t2[1]);
}

TestsCoco.Simulator.Chooser.prototype.time_similarity = function (t_q1,t_q2,max_time){
    return 1 - (Math.abs((t_q1 - t_q2)) / max_time);
}

TestsCoco.Simulator.Chooser.prototype.QuestionSimilarity = function (q1,q2){
    var tool = new TestsCoco.Tools();
    var max_time = tool.getMaxOfArray(tool.getValuesOfObject(this.time));
    var t_sim = this.time_similarity(this.time[q1],this.time[q2],max_time);
    var s_sim = this.syntax_similarity(this.enonces[q1],this.enonces[q2]);
    return t_sim * s_sim;
}

TestsCoco.Simulator.Chooser.prototype.similarity = function (tab) {
    var _this = this,
        ret = [];
    
    $.each(tab, function(index, value) {
        ret[index] = [];
        $.each(tab, function(index2, value2) {
            ret[index][index2] = _this.QuestionSimilarity(index,index2);
        });
    });
    
    return ret;
}

TestsCoco.Simulator.Chooser.prototype.getData = function (data1,data2){
    
    //nombre de fois où la question à été vue
    this.nb_shown = this.countOccurences(data1,data2).shown;
    
    //nombre total de vote que la question a reçue
    this.nb_vote = this.countOccurences(data1,data2).votted;
    
    //nombre total de votes positif que la question a reçue
    this.nb_positive_vote = this.countOccurences(data1,data2).positive_vote;

    //somme de tous les votes
    this.vote_sum = this.positive(data1);

    //pourcentage de votes positif par rapport au nombre total de votes
    this.popularity = this.percentage(this.nb_positive_vote,this.nb_vote);

    //tableau contenant tous les timecode de début de question
    this.time = this.getTime(data2);

    //tableau contenant tous les énoncés de questions
    this.enonces = this.getEnonce(data2);
    
};

TestsCoco.Simulator.Chooser.prototype.getScore = function (q){
    var score = (this.nb_shown[q.id] < 5) ? 1 : this.popularity[q.id];
    return score;
}

TestsCoco.Simulator.Chooser.prototype.getAllScores = function (tab){
    var _this = this;
    var scores = {};
    $.each(tab.annotations, function(index,value){
        scores[value.id] = _this.getScore(value);
    });
    return scores;
}

TestsCoco.Simulator.Chooser.prototype.getProba = function (q,tab_score){
    var tool = new TestsCoco.Tools();
    var array_score = tool.getValuesOfObject(tab_score);
    var score_sum = array_score.reduce(function(a, b) {
                                return a + b;
                    },0);
    return this.getScore(q) / score_sum ;
}

TestsCoco.Simulator.Chooser.prototype.getAllProba = function (tab_quest,tab_score){
    var _this = this;
    var probas = {};
    $.each(tab_quest.annotations, function(index,value){
        probas[value.id] = _this.getProba(value,tab_score);
    });
    return probas;
}

TestsCoco.Simulator.Chooser.prototype.choose = function (d1,d2,numberOfQuestions) {
    var _this = this;
    var tool = new TestsCoco.Tools();
    var questionsToDisplay = [];
    
    var sim = this.similarity(this.time);

    var scores = this.getAllScores(d2);
    
    var probas = this.getAllProba(d2,scores);

    var allQuestions = tool.arrayWithProbability(scores);
    
    do{
        var quest = tool.randomWithProbability(allQuestions);
        var good = true;
        
        $.each(questionsToDisplay, function(index, value) {
            if(sim[quest][value] > 0.5){
                good = false;
            }
        });
        
        if(good){
            questionsToDisplay.push(quest);
        }
        
    }while(questionsToDisplay.length < numberOfQuestions)
    
    return questionsToDisplay;
}
TestsCoco.Simulator.Chooser.prototype.getChoosenQuestions = function (d1,d2,numberOfQuestions){

    var disp = this.choose(d1,d2,numberOfQuestions);

    var choosenQuestions = [];
    
    $.each(d2.annotations, function(index,value){
        if($.inArray(value.id,disp) != -1){
            choosenQuestions.push(value);
        }
    });
    
    return {annotations : choosenQuestions};
}

TestsCoco.Simulator.Chooser.prototype.main = function (d1,d2,numberOfQuestions,media){
    var _this = this;
    console.log(_.groupBy(d2,'medias'));
    this.getData(d1,d2);
    
    return this.getChoosenQuestions(d1,d2,numberOfQuestions);
}
