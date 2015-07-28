TestsCoco.User = function(name,profile,session_dates){
    this.name = name;
    this.profile = profile;
    this.session_dates = session_dates;
    
    this.date_property = {};
    this.date_property.dayInMillisecond = 86400000;
    this.date_property.hourInMillisecond = 3600000;
    this.date_property.minuteInMillisecond = 60000;
}

TestsCoco.User.prototype.setSessionDates = function(start,nb_tours,documents) {
    var _this = this;
    var tool = new TestsCoco.Tools();
    var dates = [];
    
    var cases = {
      "regular": function(tab) {
                    var doc = _.random(documents.length-1);
                    var media = documents[doc].medias[0].id;
                    var session_id = tool.generateUid();
                    tab.push({'id':session_id,'date':start,'media':media});
                    for(var i = 1; i < nb_tours; i++){
                        var session_id = tool.generateUid();
                        var doc = _.random(documents.length-1);
                        var media = documents[doc].medias[0].id;
                        var max_time = _.max(documents[doc].annotations,"end").end;
                        var d = new Date();
                        var offset = d.getTimezoneOffset();
                        var temp = tab[i-1].date;
                        var hours = _.random(9,20);
                        d.setTime(temp.getTime() + offset + _.random(1) * _this.date_property.dayInMillisecond + max_time + hours * _this.date_property.hourInMillisecond);
                        tab.push({'id':session_id,'date':d,'media':media});
                    }
                    return tab;
                },
      "random": function(tab) {
                    var doc = _.random(documents.length-1);
                    var media = documents[doc].medias[0].id;
                    var session_id = tool.generateUid();
                    tab.push({'id':session_id,'date':start,'media':media});
                    for(var i = 1; i < nb_tours; i++){
                        var session_id = tool.generateUid();
                        var doc = _.random(documents.length-1);
                        var media = documents[doc].medias[0].id;
                        var max_time = _.max(documents[doc].annotations,"end").end;
                        var d = new Date();
                        var offset = d.getTimezoneOffset();
                        var temp = tab[i-1].date;
                        d.setTime(temp.getTime() + offset + _.random(3) * _this.date_property.dayInMillisecond + max_time);
                        tab.push({'id':session_id,'date':d,'media':media});
                    }
                    return tab;
                },
      _default: function() { console.log('Profile not implemented'); }
    };

    this.session_dates = cases[ this.profile ] ? cases[ this.profile ](dates) : cases._default();
}
