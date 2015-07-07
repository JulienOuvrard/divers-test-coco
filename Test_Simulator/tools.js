TestsCoco.Tools = function(){};

TestsCoco.Tools.prototype.generateUid = function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
}
        
TestsCoco.Tools.prototype.pickRandomNumber = function (min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

TestsCoco.Tools.prototype.arrayUnique = function (array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

TestsCoco.Tools.prototype.randomDate = function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

TestsCoco.Tools.prototype.downloadJson = function (data_to_dl,container,texte,filename){
    $(container).empty();
    
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data_to_dl, null, 4));

    $('<a href="data:' + data + '" download="'+filename+'.json">'+texte+'</a>').appendTo(container);
}
