TestsCoco.Simulator.Questions = function(){};

TestsCoco.Simulator.Questions.prototype.getStopWords = function (data1,data2){
    return data1[0].split("\n").concat(data2[0].split("\n")).map(function(s){return s.trim()});
}

TestsCoco.Simulator.Questions.prototype.cleaningText = function (str){
    return str.toLowerCase()
                .replace(//g," ")
                .replace(/\n/g," ")
                .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()\?@""]/g," ")
                .replace(/[\d]/g," ");
}

TestsCoco.Simulator.Questions.prototype.getDonnees = function (data){
    var _this = this;
    var ret = [];
    var annotations = data.annotations;
    annotations.forEach(function(elem,index){
        if(elem.meta["id-ref"] == "Slides"){
            var donnee = {};
            donnee.deb = elem.begin;
            donnee.fin = elem.end;
            var txt = elem.content.description;
            var mots = _this.cleaningText(txt).split(" ");
            donnee.texte = mots ;
            ret.push(donnee);
        }
    });
    return ret
}

TestsCoco.Simulator.Questions.prototype.getAllWords = function (data){
    var tool = new TestsCoco.Tools();
    var words = [];
    $.each(data,function(index,value){
        words = words.concat(value.texte);
    });
    return tool.arrayUnique(words);
}

TestsCoco.Simulator.Questions.prototype.filterStopWords = function (str){
    return !($.inArray(str,this) > -1);
}

TestsCoco.Simulator.Questions.prototype.filtering = function (d,stpw){
    var _this = this;
    $.each(d,function(index,value){
        var tab_str = value.texte;
        var new_tab = tab_str.filter(_this.filterStopWords,stpw);
        value.texte=new_tab;
    });
}

TestsCoco.Simulator.Questions.prototype.getFrequencies = function (arr){
    var ret = {};
    $.each(arr, function(index,value){
        ret[value] = ret[value] ? ret[value]+1 : 1;
    });
    return ret;
}

TestsCoco.Simulator.Questions.prototype.generateTime = function (obj){
    var tool = new TestsCoco.Tools();
    return _.random(obj.deb,obj.fin);
}

TestsCoco.Simulator.Questions.prototype.generateTxt = function (tab,l_min,l_max,tab_other){
    var words;
    var txt="";
    var long = _.random(l_min,l_max);
    
    if((tab_other != null || tab_other.length != 0 || tab_other != undefined) && (tab.length < long)){
        words = tab.concat(tab_other);
    }else{
        words = tab;
    }
    
    for(var i=0; i<=long; i++){
            var index = _.random(words.length);
            txt+= words[index]+" ";
    }
    return txt;
}

TestsCoco.Simulator.Questions.prototype.generateQuestion = function (tab_mots,longMin,longMax,nbRepMin,nbRepMax,otherTab){
    var _this = this;
    var question = {};
    var enonce = _this.generateTxt(tab_mots,longMin,longMax,otherTab);
    var reponses = [];
    var nbRep = _.random(nbRepMin,nbRepMax);
    var correctRep = _.random(nbRep);
    for(var i = 0; i < nbRep; i++){
        var ans = {};
        var rep = _this.generateTxt(tab_mots,longMin,longMax,otherTab);
        ans.content = rep;
        if(i == correctRep){
            ans.correct = true;
        }
        reponses[i] = ans;
    }
    question.description = enonce;
    question.answers = reponses;
    return question;
}

TestsCoco.Simulator.Questions.prototype.generate = function (tab,media,nombre,longMin,longMax,nbRepMin,nbRepMax,otherWords){
    var tool = new TestsCoco.Tools();
    var _this = this;
    var retour=[];
    for(var i = 0 ; i < nombre ; i++){
       var idx = _.random(tab.length);
       var obj = tab[idx];
       var obj_av = tab[idx-1];
       var obj_ap = tab[idx+1];
       var time = _this.generateTime(obj);
       var mots; 
       var t1 = obj.texte, t2, t3;
       if(idx > 0 && idx < tab.length - 1){
           t2 = tab[idx-1].texte;
           t3 = tab[idx+1].texte;
           mots = t2.concat(t1).concat(t3);
       }else if (idx == 0){
           t2 = tab[idx+1].texte;
           mots = t1.concat(t2);
       }else{
           t2=tab[idx-1].texte;
           mots = t1.concat(t2);
       }
       var quest= {};
       quest.content =  _this.generateQuestion(mots,longMin,longMax,nbRepMin,nbRepMax,otherWords);
       quest.begin = time;
       quest.end = time+3000;
       quest.type = "Quizz";
       quest.media = media;
       quest.id = tool.generateUid();
       retour[i] = quest;
    }

    return retour;
}

TestsCoco.Simulator.Questions.prototype.main = function (stop_word1,stop_word2,documents,other,nb_questions){
    var _this = this;
    var stopwords_fr = this.getStopWords(stop_word1,stop_word2);
    var allQuest = [];
    documents.forEach(function(elem){

        var media = elem.medias[0].id;
        var donnees = _this.getDonnees(elem);
        
        _this.filtering(donnees,stopwords_fr);
        
        var all_words = other ? _this.getAllWords(donnees) : [];
        
        allQuest = allQuest.concat(_this.generate(donnees,media,nb_questions,5,10,2,5,all_words));
    });
    
    return {"annotations" : allQuest};
    
}
