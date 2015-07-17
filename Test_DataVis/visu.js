var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var tool = new TestsCoco.Tools();
var visualizer = new TestsCoco.DataVis(".analytics");

var users = [{name : "marcel", profile : "regular"},
            {name : "roger", profile : "random"},
            {name : "jacky", profile : "regular"},
            {name : "pierre", profile : "regular"},
            {name : "marc", profile : "random"},
            {name : "alfred", profile : "regular"}];
            
function simulate(){
    $.when($.get("../Donnees_tests/questions_1file.json"),
            $.get("../Donnees_tests/answers_1file.json"))
        .done(function(data1,data2){
                visualizer.main(data1[0],data2[0]);
            }
        );
}

simulate();

