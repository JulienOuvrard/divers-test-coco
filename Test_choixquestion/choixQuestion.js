//url_analytics : http://comin-ocw.org/devpf/api/analytics/
//url_data : http://comin-ocw.org/devpf/api/annotations/
var chooser = new TestsCoco.Simulator.Chooser();
$.when($.get("../Donnees_tests/chooser_data/answers.json"),
        $.get("../Donnees_tests/chooser_data/questions.json"))
    .done(function(dat1,dat2){
        chooser.getData(dat1,dat2)
        });
