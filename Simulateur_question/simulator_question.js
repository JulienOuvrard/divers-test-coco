function generateUid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
}
        
function pickRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

function getStopWords(data1,data2){
    return data1[0].split("\n").concat(data2[0].split("\n")).map(function(s){return s.trim()});
}

function cleaningText(str){
    return str.toLowerCase()
                .replace(//g," ")
                .replace(/\n/g," ")
                .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()\?@""]/g," ")
                .replace(/[\d]/g," ");
}

function getDonnees(data){
    var ret = [];
    var annotations = data[0].annotations;
    annotations.forEach(function(elem,index){
        if(elem.meta["id-ref"] == "Slides"){
            var donnee = {};
            donnee.deb = elem.begin;
            donnee.fin = elem.end;
            var txt = elem.content.description;
            var mots = cleaningText(txt).split(" ");
            donnee.texte = mots ;
            ret.push(donnee);
        }
    });
    return ret
}

function getAllWords(data){
    var words = [];
    $.each(data,function(index,value){
        words = words.concat(value.texte);
    });
    return arrayUnique(words);
}

function filterStopWords(str){
    return !($.inArray(str,this) > -1);
}

function filtering(d,stpw){
    $.each(d,function(index,value){
        var tab_str = value.texte;
        var new_tab = tab_str.filter(filterStopWords,stpw);
        value.texte=new_tab;
    });
}

function getFrequencies(arr){
    var ret = {};
    $.each(arr, function(index,value){
        ret[value] = ret[value] ? ret[value]+1 : 1;
    });
    return ret;
}

function generateTime(obj){
    return pickRandomNumber(obj.deb,obj.fin);
}

function generateTxt(tab,l_min,l_max,tab_other){
    var words;
    var txt="";
    var long = pickRandomNumber(l_min,l_max);
    
    if((tab_other != null || tab_other.length != 0 || tab_other != undefined) && (tab.length < long)){
        words = tab.concat(tab_other);
    }else{
        words = tab;
    }
    
    for(var i=0; i<=long; i++){
            var index = pickRandomNumber(0,words.length);
            txt+= words[index]+" ";
    }
    return txt;
}

function generateQuestion(tab_mots,longMin,longMax,nbRepMin,nbRepMax,otherTab){
    var question = {};
    var enonce = generateTxt(tab_mots,longMin,longMax,otherTab);
    var reponses = [];
    var nbRep = pickRandomNumber(nbRepMin,nbRepMax);
    var correctRep = pickRandomNumber(0,nbRep);
    for(var i = 0; i < nbRep; i++){
        var ans = {};
        var rep = generateTxt(tab_mots,longMin,longMax,otherTab);
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

function generate(tab,nombre,longMin,longMax,nbRepMin,nbRepMax,otherWords){
    var retour=[];
    for(var i = 0 ; i < nombre ; i++){
       var idx = pickRandomNumber(0,tab.length);
       var obj = tab[idx];
       var obj_av = tab[idx-1];
       var obj_ap = tab[idx+1];
       var time = generateTime(obj);
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
       quest.content =  generateQuestion(mots,longMin,longMax,nbRepMin,nbRepMax,otherWords);
       quest.begin = time;
       quest.end = time+3000;
       quest.type = "Quizz";
       quest.id = generateUid();
       retour[i] = quest;
    }

    return retour;
}

function downloadJson(data_to_dl,container,texte,filename){
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data_to_dl, null, 4));

    $('<a href="data:' + data + '" download="'+filename+'.json">'+texte+'</a>').appendTo(container);
}

function main(d1,d2,d3){
    
    var stopwords_fr = getStopWords(d1,d2);
    //console.table(stopwords_fr);
    
    var donnees = getDonnees(d3);
    
    filtering(donnees,stopwords_fr);
    //console.table(donnees);
    
    var all_words = getAllWords(donnees);
    
    var questions =  {"annotations" : generate(donnees,50,5,10,2,5,[])};
    //console.table(questions);
    downloadJson(questions,'#first','Télécharger les questions sans mots supplémentaire','questions');
    
    var questions2 = {"annotations" : generate(donnees,50,5,10,2,5,all_words)};
    
    downloadJson(questions2,'#second','Télécharger les questions avec mots supplémentaire','questions2');
}

$.when($.get("stop-words_french_1_fr.txt"), $.get("stop-words_french_2_fr.txt"), $.get("data.json"))
    .done(function(data1,data2,data3){
        main(data1,data2,data3);
        }
    );
