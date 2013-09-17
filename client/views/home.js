
var page = {
  gid: function(arg) {
    if (!arg) {
      return $("#gid").val();
    } else {
      $("#gid").val(arg);
    }
  },
  join: function() {
    var button = $("#join");
    button.enable = function() {
      this.removeAttr("disabled");
    };
    button.disable = function() {
      this.attr("disabled", "disabled");
    }
    return button;
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #start" : function () {
  var game = { gid: newId(6) };
  Games.insert(game);
  page.gid(game.gid);
  page.join().enable();
}});

Template.home.events({"keyup #gid" : function() {
  var gid = page.gid();
  // TODO: check gid.length == 6 and all chars 0-9a-e
  //       if not, disable without doing Games.findOne()
  if (!Games.findOne({ gid: gid })) {
    page.join().disable();
  } else {
    page.join().enable();
  }
}});

Template.home.events({'click #join': function() {
  var gid = page.gid();
  var game = Games.findOne({ gid: gid });
  if (game === undefined) {
    openDialog("There is no game with that id.");
    return;
  } 
  //TODO: atomic?
  var teamColor = _.find(teamColors(), function(color) {
    return !Edges.findOne({ gid: gid, teamColor: color });
  });
  //TODO: if teamColor === undefined, then openDialog(game already has 4 players)
  Edges.insert({ gid: gid, teamColor: teamColor });
  setupTeam(gid,teamColor);  
  window.open("edge/" + gid + "/" + teamColor, "_blank");  
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 
// slimed
//
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
  makeStory(5, 5, [oneColor,"orange"]);
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

