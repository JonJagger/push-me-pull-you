
var home = Template.home;

home.greeting = function () {
  return 'The Kanban Ones Game';
};

home.events({
  'click #new_game' : function () {
    var game = { gid: newId(6) };
    Games.insert(game);
    $('#gid').val(game.gid);
  }
});

home.events({
  'click #join_game': function() {
    var gid = $('#gid').val();
    var game = Games.findOne({ gid: gid });
    if (game === undefined) {
      var message = "There is no game with that id.";
      setStatus(message);
      openDialog(gid + ' ?', message);
    } else {
      //need to pick an edge, atomic?
      var colour = _.find([ 'red', 'orange', 'blue', 'green'], function(c) {
        return Edges.findOne({ gid: gid, colour: c }) === undefined;
      });
      var edge = { gid: gid, colour: colour };
      Edges.insert(edge);
      Stories.insert({ gid: gid, colour: colour, ones: "1", size: "1" });
      Stories.insert({ gid: gid, colour: colour, ones: "2", size: "2" });
      Stories.insert({ gid: gid, colour: colour, ones: "0", size: "5" });      
      Router.go('edge', edge);
    }
  }
});

