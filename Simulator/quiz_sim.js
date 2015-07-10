var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var chooser = new TestsCoco.Simulator.Chooser();
var visualizer = new TestsCoco.DataVis();

var tool = new TestsCoco.Tools();

var users = [{name : "Alfred", profile : "regular"},
            {name : "Bernard", profile : "random"},
            {name : "Charlot", profile : "regular"},
            {name : "Daniel", profile : "regular"},
            {name : "Eric", profile : "random"},
            {name : "Francky", profile : "regular"}];

function simulate(other_words,nb_tours,nb_question_by_tours,nb_questions){
    $.when($.get("../Donnees_tests/simulator_data/stop-words_french_1_fr.txt"),
            $.get("../Donnees_tests/simulator_data/stop-words_french_2_fr.txt"),
            $.get("../Donnees_tests/simulator_data/data.json"))
        .done(function(data1,data2,data3){
                var questions = quest_sim.main(data1,data2,data3,other_words,nb_questions),
                    answers = [],
                    selection;
                
                var max_time = _.max(data3[0].annotations,"end").end;
                
                $.each(users,function(index,value){
                    selection = chooser.main(answers,questions,nb_question_by_tours);
                    answers = answers.concat(ans_sim.main(selection,nb_question_by_tours,value,nb_tours,max_time));
                });
                console.table(answers);
                
                tool.downloadJson(questions,'#quest',"questions",'questions');
                tool.downloadJson(answers,'#ans',"answers",'answers');
                
                visualizer.main(".analytics",questions,answers);
                
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
