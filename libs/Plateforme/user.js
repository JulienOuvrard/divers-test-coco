TestsCoco.User = function(name,profile,session_dates){
    this.name = name;
    this.profile = profile;
    this.session_dates = session_dates;
    
    this.date_property = {};
    this.date_property.dayInMillisecond = 86400000;
    this.date_property.hourInMillisecond = 3600000;
    this.date_property.minuteInMillisecond = 60000;
}

TestsCoco.User.prototype.setSessionDates = function(start,nb_tours,max_time) {
    var _this = this;
    var dates = [];
    
    var cases = {
      "regular": function(tab) {
                    tab.push(start);
                    for(var i = 1; i < nb_tours; i++){
                        var d = new Date();
                        var offset = d.getTimezoneOffset();
                        var temp = tab[i-1];
                        var hours = _.random(9,20);
                        d.setTime(temp.getTime() + offset + _.random(1) * _this.date_property.dayInMillisecond + max_time + hours * _this.date_property.hourInMillisecond);
                        tab.push(d);
                    }
                    return tab;
                },
      "random": function(tab) {
                    tab.push(start);
                    for(var i = 1; i < nb_tours; i++){
                        var d = new Date();
                        var offset = d.getTimezoneOffset();
                        var temp = tab[i-1];
                        d.setTime(temp.getTime() + offset + _.random(3) * _this.date_property.dayInMillisecond + max_time);
                        tab.push(d);
                    }
                    return tab;
                },
      _default: function() { console.log('Profile not implemented'); }
    };

    this.session_dates = cases[ this.profile ] ? cases[ this.profile ](dates) : cases._default();
}
