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

TestsCoco.Tools.prototype.transpose = function(a) {

      // Calculate the width and height of the Array
      var w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;

      // In case it is a zero matrix, no transpose routine needed.
      if(h === 0 || w === 0) { return []; }

      /**
       * @var {Number} i Counter
       * @var {Number} j Counter
       * @var {Array} t Transposed data is stored in this array.
       */
      var i, j, t = [];

      // Loop through every item in the outer array (height)
      for(i=0; i<h; i++) {

        // Insert a new row (array)
        t[i] = [];

        // Loop through every item per item in outer array (width)
        for(j=0; j<w; j++) {

          // Save transposed data.
          t[i][j] = a[j][i];
        }
      }

      return t;
};

TestsCoco.Tools.prototype.dot = function (v1,v2){
    var res = 0;
    for(var i = 0;i < v1.length;i++){
        res+= (v1[i]*v2[i]);
    }
    return res;
}

TestsCoco.Tools.prototype.norm = function (v){
    var res = 0, temp=0;
    v.forEach(function(elem){
        temp+=elem*elem
    });
    res=Math.sqrt(temp);
    return res;
}

TestsCoco.Tools.prototype.cosine = function (v1,v2){
    return (this.dot(v1,v2)/(this.norm(v1)*this.norm(v2)));
}
