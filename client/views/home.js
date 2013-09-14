
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
  if (gid === 'id' || gid === undefined) {
    openDialog(gid + ' ?', "Press [New&nbsp;game] to get an id.");
    return;
  } 
  // TODO: if gid contains now 0-9a-z characters give specific dialog
  var game = Games.findOne({ gid: gid });
  if (game === undefined) {
    openDialog(gid + ' ?', "There is no game with that id.");
    return
  } 
  //TODO: atomic?
  var teamColor = _.find(teamColors(), function(c) {
    return Edges.findOne({ gid: gid, color: c }) === undefined;
  });
  //TODO: if color === undefined
  //  game already has N players dialog
  var edge = { gid: gid, teamColor: teamColor };
  Edges.insert(edge);
  
  //TODO: I need the color of the edge (eColour?)
  //      and the colour of the kanban holding the story (kColour?)
  //      The gid+edgeColour is really an edgeId
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: "1", size: "1" });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: "2", size: "2" });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: "0", size: "5" });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'orange', ones: "0", size: "0" });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: 'red',    ones: "0", size: "0" });      
  Router.go('edge', edge);
}});

