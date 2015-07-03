function pickRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
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

function generateTxt(tab,l_min,l_max){
    var txt="";
    var long = pickRandomNumber(l_min,l_max);
    for(var i=0; i<=long; i++){
        var index = pickRandomNumber(0,tab.length);
        txt+= tab[index]+" ";
    }
    return txt;
}

function generateQuestion(tab_mots,longMin,longMax,nbRepMin,nbRepMax){
    var question = {};
    var description = generateTxt(tab_mots,longMin,longMax);
    var answers = {};
    var nbRep = pickRandomNumber(nbRepMin,nbRepMax);
    for(var i = 0; i < nbRep; i++){
        var rep = generateTxt(tab_mots,longMin,longMax);
        answers[i] = rep;
    }
    question.enonce = description;
    question.reponses = answers;
    return question;
}

function generate(tab,nombre,longMin,longMax,nbRepMin,nbRepMax){
    var retour={};
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
       var quest =  generateQuestion(mots,longMin,longMax,nbRepMin,nbRepMax);
       quest.time = time;
       retour[i] = quest;
    }

    return retour;
}

function main(d1,d2,d3){
    
    var stopwords_fr = getStopWords(d1,d2);
    //console.table(stopwords_fr);
    
    var donnees = getDonnees(d3);
    
    filtering(donnees,stopwords_fr);
    //console.table(donnees);
    
    var questions =  generate(donnees,50,5,10,2,5);
    //console.table(questions);
    
    localStorage.setItem('questions', JSON.stringify(questions));
}

$.when($.get("stop-words_french_1_fr.txt"), $.get("stop-words_french_2_fr.txt"), $.get("data.json"))
    .done(function(data1,data2,data3){
        main(data1,data2,data3);
        }
    );
