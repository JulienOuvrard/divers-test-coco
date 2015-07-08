var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var chooser = new TestsCoco.Simulator.Chooser();
var tool = new TestsCoco.Tools();

var numberOfQuestions = 10;

var users = [{name : "marcel", profile : "regular"},
            {name : "roger", profile : "random"},
            {name : "jacky", profile : "regular"},
            {name : "pierre", profile : "regular"},
            {name : "marc", profile : "random"},
            {name : "alfred", profile : "regular"}];

function simulate(o,n){
    $.when($.get("../Donnees_tests/simulator_data/stop-words_french_1_fr.txt"),
            $.get("../Donnees_tests/simulator_data/stop-words_french_2_fr.txt"),
            $.get("../Donnees_tests/simulator_data/data.json"))
        .done(function(data1,data2,data3){
                var q = quest_sim.main(data1,data2,data3,o);
                
                //Si on veut toutes les questions
                //numberOfQuestions = q.annotations.length;
                var a = ans_sim.main(q,numberOfQuestions,users,o);
                var c = chooser.main(a,q,numberOfQuestions);
                
                console.log(c);
            }
        );
}

$("#go").on("click",function(){
    var nb_tours = $("#nb_tours").val();
    var other = $("#other_words:checked").length;
    simulate(other,nb_tours);
});
