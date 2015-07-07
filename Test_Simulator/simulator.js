var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var tool = new TestsCoco.Tools();

function simulate(o){
    $.when($.get("stop-words_french_1_fr.txt"), $.get("stop-words_french_2_fr.txt"), $.get("data.json"))
        .done(function(data1,data2,data3){
                var q = quest_sim.main(data1,data2,data3,o);
                var a = ans_sim.main(q,o);
                var txt_q,txt_a = 'Télécharger les réponses correspondant au jeu de donnees généré';
                if(!o){
                    txt_q = 'Télécharger les questions sans mots supplémentaire';
                }else{
                    txt_q = 'Télécharger les questions avec mots supplémentaire';
                }
                tool.downloadJson(q,'#quest',txt_q,'questions');
                tool.downloadJson(a,'#ans',txt_a,'answers');
            }
        );
}

var other = $("#other_words:checked").length;
simulate(other);

$("#other_words").on("click",function(){
    var other2 = $("#other_words:checked").length;
    simulate(other2);
});



