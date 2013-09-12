
var home = Template.home;

home.greeting = function () {
  return 'The Kanban Ones Game';
};

home.events({
  'click input#start_a_new_game' : function () {
    var hex = 16;
    var gid = 'xxxxxx'.replace(/[x]/g, function() {      
        return (Math.random() * hex | 0).toString(hex);
    });          
    Games.insert({ gid: gid });
    $('#gid').val(gid);
  }
});

home.events({
  'click input#join_an_existing_game': function() {
    var gid = $('#gid').val();
    var game = Games.findOne({ gid: gid });
    if (game === undefined) {
      var message = "Sorry. No game with that id";
      setStatus(message);
      openDialog(gid + ' ?', message);
    } else {
      //need to pick an edge, needs to be atomic
      Router.go('edge', { gid: gid });
    }
  }
});

