
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
      var color = _.find(edgeColors(), function(c) {
        return Edges.findOne({ gid: gid, color: c }) === undefined;
      });
      var edge = { gid: gid, color: color };
      Edges.insert(edge);
      Stories.insert({ gid: gid, color: color, ones: "1", size: "1" });
      Stories.insert({ gid: gid, color: color, ones: "2", size: "2" });
      Stories.insert({ gid: gid, color: color, ones: "0", size: "5" });      
      Router.go('edge', edge);
    }
  }
});

