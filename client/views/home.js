
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
  setupTeam(gid,teamColor);  
  Router.go('edge', edge);
}});

var setupTeam = function(gid,teamColor) {
  var kanbanColor = teamColor;
  var oneColor = teamColor;
  
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: kanbanColor, size: 1, ones: [ ] });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: kanbanColor, size: 2, ones: [oneColor,oneColor] });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: kanbanColor, size: 4, ones: [oneColor] });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: kanbanColor, size: 3, ones: [oneColor,oneColor] });
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: kanbanColor, size: 5, ones: [ ] });      
  Stories.insert({ gid: gid, teamColor: teamColor, kanbanColor: kanbanColor, size: 1, ones: [oneColor] });
  
  _(6).times(function() {
      Dice.insert({ gid: gid, teamColor: teamColor, color: teamColor, value: rollDie() });
  });
};

