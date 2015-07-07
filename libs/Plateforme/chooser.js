TestsCoco.Simulator.Chooser = function(){};

var _delta_time = 10000;

TestsCoco.Simulator.Chooser.prototype.countOccurences = function (tab){
    
    var shown_properties = ["right_answer","wrong_answer","skipped_answer"];
    var votted_properties = ["usefull","useless","skipped_vote"];
    
    var shown = {};
    var votted = {};
    var positive_vote = {};
    
    tab.forEach(function(elem){
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
    
    return {"shown":shown,"votted":votted,"positive_vote":positive_vote};
}

TestsCoco.Simulator.Chooser.prototype.percentage = function (tab1,tab2){
    var result = {};
    $.each(tab2, function(index, value) {
        if(!tab1[index]){
            result[index]=0;
        }else{
            result[index]=(tab1[index] / (value) * 100);
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

TestsCoco.Simulator.Chooser.prototype.time_similarity = function (t_q1,t_q2){
    return Math.abs((t_q1 - t_q2));
}

TestsCoco.Simulator.Chooser.prototype.similarity = function (tab_time,tab_enonce) {
    var _this =this;
    
    time_sim = [];
    synt_sim = [];
    
    $.each(tab_time, function(index, value) {
        var temp = $.extend(true, {}, tab_time);
        delete temp[index];
        time_sim[index] = [];
        synt_sim[index] = [];
        $.each(temp, function(index2, value2) {
            //console.log(enonces[index]+" | "+enonces[index2]);
            time_sim[index][index2] = _this.time_similarity(tab_time[index],tab_time[index2]);
            //console.log("time gap : "+time_similarity(index,index2));
            //console.log("cosine measure : "+syntax_similarity(enonces[index],enonces[index2]));
            synt_sim[index][index2] = _this.syntax_similarity(tab_enonce[index],tab_enonce[index2]);
        });
    });
    
    console.table(time_sim);
    console.table(synt_sim);
}

TestsCoco.Simulator.Chooser.prototype.getData = function (data1,data2){
    
    //console.log('nb_shown : ');
    var nb_shown = this.countOccurences(data1[0]).shown;
    //console.log(nb_shown);
    
    //console.log("nb_vote : ");
    var nb_vote = this.countOccurences(data1[0]).votted;
    //console.log(nb_vote);
    
    //console.log("positive vote : ");
    var nb_positive_vote = this.countOccurences(data1[0]).positive_vote;
    //console.log(nb_positive_vote);
    
    //console.log("global appreciation : ");
    var pos = this.positive(data1[0]);
    //console.log(pos);
    
    //console.log("popularity : ");
    var popularity= this.percentage(nb_positive_vote,nb_vote);
    //console.log(popularity);
    
    //console.log("Time : ");
    var time = this.getTime(data2[0]);
    //console.log(time);
    
    //console.log('Enoncés : ');
    var enonces = this.getEnonce(data2[0]);
    //console.log(enonces);
    
    this.similarity(time,enonces);

};
