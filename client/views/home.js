
var home = Template.home;

home.greeting = function () {
  return 'The Kanban Ones Game';
};

home.events({'click #new_game' : function () {
  var game = { gid: newId(6) };
  Games.insert(game);
  $('#gid').val(game.gid);
}});

home.events({'click #join_game': function() {
  var gid = $('#gid').val();
  if (gid === 'id' || gid === '') {
    openDialog(gid + ' ?', 'Press [New&nbsp;game] to get an id.');
    return;
  } 
  var game = Games.findOne({ gid: gid });
  if (game === undefined) {
    openDialog(gid + ' ?', 'There is no game with that id.');
    return
  } 
  //TODO: atomic?
  var teamColor = _.find(teamColors(), function(color) {
    return Edges.findOne({ gid: gid, teamColor: color }) === undefined;
  });
  //TODO: if color === undefined, then game already has 4 players dialog
  var edge = { gid: gid, teamColor: teamColor };
  Edges.insert(edge);
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 0, size: 1 });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 2, size: 2 });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 0, size: 5 });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 2, size: 3 });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 0, size: 5 });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 1, size: 1 });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'orange', ones: 0, size: 0 });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: 0, size: 0 });      
  Router.go('edge', edge);
}});

