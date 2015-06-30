
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

function similaire(q1,q2){
   
    if(Math.abs((time[q1] - time[q2])) < _delta_time){
        return true;
    }else {
        return false
    }
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
    
    
    $.each(time, function(index, value) {
        $("#content").append(index+" : ");
        var temp = $.extend(true, {}, time);
        delete temp[index];
        $.each(temp, function(index2, value2) {
            if(similaire(index,index2)){
                $("#content").append(index2+" | ");
            }
        });
        $("#content").append("<br>")
    }); 
    

};

//url_analytics : http://comin-ocw.org/devpf/api/analytics/
//url_data : http://comin-ocw.org/devpf/api/annotations/

$.when($.get("analytics.json"), $.get("data.json")).done(function(dat1,dat2){getData(dat1,dat2)});

