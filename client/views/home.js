
var Page = {
  gid: function() {
    return $("#gid").val();
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.greeting = function () {
  return "The Kanban Ones Game";
};

Template.home.events({"click #start" : function () {
  var game = { gid: newId(6) };
  Games.insert(game);
  $("#gid").val(game.gid);
}});

Template.home.events({"keyup #gid" : function() {  
  if (Games.findOne({ gid: Page.gid() }) === undefined) {
    $("#join").attr("disabled", "disabled");
  } else {
    $("#join").removeAttr("disabled");
  }
}});

Template.home.events({'click #join': function() {
  var gid = Page.gid();
  if (gid === "id" || gid === "") {
    openDialog("Press [start] to get an id.");
    return;
  } 
  var game = Games.findOne({ gid: gid });
  if (game === undefined) {
    openDialog("There is no game with that id.");
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
  Router.go("edge", edge);
}});

var setupTeam = function(gid,teamColor) {
  var kanbanColor = teamColor;
  var oneColor = teamColor;
  
  var makeStory = function(kanbanSize, size, ones) {
    Stories.insert({ gid: gid, teamColor: teamColor,
                     kanbanColor: kanbanColor, kanbanSize: kanbanSize,
                     size: size, ones: ones });    
  };
  makeStory(1, 1, [ ]);
  makeStory(3, 2, [oneColor,oneColor]);
  makeStory(5, 5, [oneColor,'orange']);
  makeStory(3, 3, [oneColor,oneColor]);
  makeStory(5, 0, [ ]);
  makeStory(4, 4, [ ]);  
  makeStory(1, 1, [oneColor]);
  makeStory(1, 0, [ ]);

  Stories.insert({ gid: gid, teamColor: teamColor,
                   kanbanColor: "orange", kanbanSize: 3,
                   size: 2, ones: ["red"] });    
  Stories.insert({ gid: gid, teamColor: teamColor,
                   kanbanColor: "orange", kanbanSize: 3,
                   size: 3, ones: ["red","red","red"] });    
  Stories.insert({ gid: gid, teamColor: teamColor,
                   kanbanColor: "red", kanbanSize: 3,
                   size: 0, ones: [ ] });    
  
  _(6).times(function() {
      Dice.insert({ gid: gid, teamColor: teamColor, color: teamColor, value: rollDie() });
  });
};

