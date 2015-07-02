function getFrequency(arr){
    var ret = {};
    $.each(arr, function(index,value){
        ret[value] = ret[value] ? ret[value]+1 : 1;
    });
    return ret;
}
function generate(arr,nombre,longmin,longmax){
    var retour={};
    for(var n=0; n<nombre; n++){
        var quest= {}, enonce = "" , reps = {};
        var long = Math.floor(Math.random() * (longmax - longmin)) + longmin;
        var nbAns = Math.floor(Math.random() * 4) + 2;
        for(var i=0; i<=long; i++){
            var index = Math.floor(Math.random() * (arr.length));
            enonce+= arr[index]+" ";
        }
        quest.desc=enonce;
        for(var j=0; j<nbAns; j++){
            var rep="";
            for(var k=0 ;k < long ;k++){
                var index2 = Math.floor(Math.random() * (arr.length));
                rep+= arr[index2]+" ";
            }
            reps[j]=rep;
        }
        quest.ans=reps;
        retour[n]=quest;
    }
    return retour;
}

renameProperty = function (obj, oldName, newName) {
     // Do nothing if the names are the same
     if (oldName == newName) {
         return obj;
     }
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
    }
    return obj;
};

function cleaningText(str){
    return str.toLowerCase().replace(//g," ").replace( /\n/g, " " );
}

$.ajax({
    url : "data.json",
    dataType: "json",
    success : function (data) {
        var donnees = [];
        var annotations = data.annotations;
        annotations.forEach(function(elem,index){
            if(elem.meta["id-ref"] == "Slides"){
                var donnee = {};
                donnee.deb = elem.begin;
                donnee.fin = elem.end;
                var txt = elem.content.description;
                var mots = cleaningText(txt).split(" ");
                donnee.texte = mots ;
                donnees.push(donnee);
            }
        });
        console.table(donnees);
        
        
        /*
        var mots = cleaningText(data).split(" ");
        console.table(mots);
        
        var freq = getFrequency(mots);
        console.table(freq);
        
        var questions = generate(mots,5,5,10);
        console.table(questions);
        
        var a = ["","ce","le"];
        var test = ["","petit","le","jour","avec","le","soir","coucou","re","tard","dos","mama","huhuu","crie","bobo","","ceci","clea","","ce","le","","ce","le","poeur","ce","cae","","ce","mo","","ce","le","","ce","matin","nate","ce","le","","quo","le","bnbn","nbnv","ccsd","","pcra","lib","","pu","sans"];
        console.log(test);
        
        var cop = $.extend(true, {}, test);
        
        $.each(test,function(index,value){
            if($.inArray(value,a) > -1){
                delete cop[index];
            }
        });
        //console.log(Object.keys(cop));
        var old_keys=Object.keys(cop);
        for(var i = 0 ; i< cop.length; i++){
            cop.renameProperty(old_keys[i],i);
        }
        
        console.log(cop);
        */
    }
});
