var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var tool = new TestsCoco.Tools();
var visualizer = new TestsCoco.DataVis();

var users = [{name : "marcel", profile : "regular"},
            {name : "roger", profile : "random"},
            {name : "jacky", profile : "regular"},
            {name : "pierre", profile : "regular"},
            {name : "marc", profile : "random"},
            {name : "alfred", profile : "regular"}];
            
function simulate(){
    $.when($.get("../Donnees_tests/questions.json"),
            $.get("../Donnees_tests/answers.json"))
        .done(function(data1,data2){
                visualizer.main(".analytics",data1[0],data2[0],users);
            }
        );
}

simulate();

