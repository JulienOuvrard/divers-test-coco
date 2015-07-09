var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var chooser = new TestsCoco.Simulator.Chooser();
var visualizer = new TestsCoco.DataVis();

var tool = new TestsCoco.Tools();

var users = [{name : "marcel", profile : "regular"},
            {name : "roger", profile : "random"},
            {name : "jacky", profile : "regular"},
            {name : "pierre", profile : "regular"},
            {name : "marc", profile : "random"},
            {name : "alfred", profile : "regular"}];

function simulate(o,nb_tours,nb_question_by_tours,nb_questions){
    $.when($.get("../Donnees_tests/simulator_data/stop-words_french_1_fr.txt"),
            $.get("../Donnees_tests/simulator_data/stop-words_french_2_fr.txt"),
            $.get("../Donnees_tests/simulator_data/data.json"))
        .done(function(data1,data2,data3){
                var q = quest_sim.main(data1,data2,data3,o,nb_questions),
                    a = [],
                    c;
                    
                $.each(users,function(index,value){
                    c = chooser.main(a,q,nb_question_by_tours);
                    a = a.concat(ans_sim.main(c,nb_question_by_tours,value,o,nb_tours));
                });
                console.table(a);
                
                tool.downloadJson(q,'#quest',"questions",'questions');
                tool.downloadJson(a,'#ans',"answers",'answers');
                
                visualizer.main(".analytics",q,a);
                
                $("#loading").css("display","none");
                $("#files").css("display","block");
            }
        );
}

$("#go").on("click",function(){
    var nb_questions = $("#nb_questions").val(),
        nb_tours = $("#nb_tours").val(),
        nb_questions_by_tours = $("#nb_questions_by_tour").val(),
        other = $("#other_words:checked").length;
    $("#loading").css("display","block");
    simulate(other,nb_tours,nb_questions_by_tours,nb_questions);
    
});
