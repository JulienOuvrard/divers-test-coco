
var _delta_time = 10000;

function countOccurences(tab){
    
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

function percentage(tab1,tab2){
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

function getTime(tab){
    var ret={};
    var ann = tab.annotations;
    ann.forEach(function(elem){
        if(elem.type == "Quizz"){
            ret[elem.id] = elem.begin;
        }
    });
    return ret;
}

function getEnonce(tab){
    var ret={};
    var ann = tab.annotations;
    ann.forEach(function(elem){
        if(elem.type == "Quizz"){
            ret[elem.id] = elem.content.description;
        }
    });
    return ret;
}

function positive(tab){
    var votted_properties = ["usefull","useless","skipped_vote"];
    var res={};
    tab.forEach(function(elem){
        if(jQuery.inArray(elem.property,votted_properties) != -1){
             if(elem.subject in res){
                 res[elem.subject] += elem.value;
             }else {
                 res[elem.subject] = 0;
             }
        }
    });
    return res;
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

function dot(v1,v2){
    var res = 0;
    for(var i = 0;i < v1.length;i++){
        res+= (v1[i]*v2[i]);
    }
    return res;
}

function norm(v){
    var res = 0, temp=0;
    v.forEach(function(elem){
        temp+=elem*elem
    });
    res=Math.sqrt(temp);
    return res;
}

function cosine(v1,v2){
    return (dot(v1,v2)/(norm(v1)*norm(v2)));
}

function syntax_similarity(phrase1,phrase2){
    
    natural.PorterStemmerFr.attach();
    p1=phrase1.tokenizeAndStem();
    p2=phrase2.tokenizeAndStem();

    //console.log(p1);
    //console.log(p2);

    var words=arrayUnique(p1.concat(p2));

    //console.log(words);

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
    
    //console.log(t1);
    var cos = [];
    $.each(t1, function(index, value) {
        var temp = $.extend(true, {}, t1);
        delete temp[index];
        $.each(temp, function(index2, value2) {
            //console.log(cosine(value,value2));
            cos.push(cosine(value,value2));
        });
    }); 
    console.log(cos);
    //return {p1,p2,t1};
}

function time_similarity(q1,q2){
    return (Math.abs((time[q1] - time[q2])) < _delta_time);
}

function getData(data1,data2){
    
    //console.log('nb_shown : ');
    nb_shown = countOccurences(data1[0]).shown;
    //console.log(nb_shown);
    
    //console.log("nb_vote : ");
    nb_vote = countOccurences(data1[0]).votted;
    //console.log(nb_vote);
    
    //console.log("positive vote : ");
    nb_positive_vote = countOccurences(data1[0]).positive_vote;
    //console.log(nb_positive_vote);
    
    //console.log("global appreciation : ");
    pos = positive(data1[0]);
    //console.log(pos);
    
    //console.log("popularity : ");
    popularity= percentage(nb_positive_vote,nb_vote);
    //console.log(popularity);
    
    //console.log("Time : ");
    time = getTime(data2[0]);
    //console.log(time);
    
    //console.log('Enoncés : ');
    enonces = getEnonce(data2[0]);
    //console.log(enonces);
    
    //$("#content").append("<ul>");
    $.each(time, function(index, value) {
        //$("#content").append("<li>"+index+" : ");
        var temp = $.extend(true, {}, time);
        delete temp[index];
        $.each(temp, function(index2, value2) {
            if(time_similarity(index,index2)){
                //$("#content").append("<ul><li>"+index2+"</li></ul>");
                console.log(index2);
            }
            /*if(syntax_similarity(enonces[index],enonces[index2])){
                console.log(enonces[index]+' | '+enonces[index2]);
            }*/
            syntax_similarity(enonces[index],enonces[index2]);
        });
        //$("#content").append("</li>")
    }); 
    //$("#content").append("</ul>");
    

};

//url_analytics : http://comin-ocw.org/devpf/api/analytics/
//url_data : http://comin-ocw.org/devpf/api/annotations/

$.when($.get("analytics.json"), $.get("data.json")).done(function(dat1,dat2){getData(dat1,dat2)});
