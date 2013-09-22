
var enableDisable = function(button) {
  button.enable = function() {
    this.removeAttr("disabled");
  };
  button.disable = function() {
    this.attr("disabled", "disabled");
  };
  return button;
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

var page = {  
  gid:function(arg) {
    if (!arg) {
      return $("#gid").val();
    } else {
      $("#gid").val(arg);
    }
  },
  join:function() {
    return enableDisable($("#join"));
  },
  dashboard:function() {
    return enableDisable($("#dashboard"));    
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #start":function () {
  var game = { gid:newId(6) };
  Games.insert(game);
  page.gid(game.gid);
  page.join().enable();
  page.dashboard().enable();
}});

// - - - - - - - - - - - - - - - - - - - - - - - -

Template.home.events({"keyup #gid":function() {
  var gid = page.gid();
  if (!Games.findOne({ gid:gid })) {
    page.join().disable();
    page.dashboard().disable();
  } else {
    // TODO: if 4 teams already joined do not enable join
    page.join().enable();
    page.dashboard().enable();
  }
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 

Template.home.events({"click #join":function() {
  var gid = page.gid();
  var game = Games.findOne({ gid:gid });
  //TODO: atomic?
  var color = _.find(teamColors(), function(teamColor) {
    return !Teams.findOne({ gid:gid, color:teamColor });
  });
  //NB: this could happen because of concurrency
  if (!color) {
    openDialog("Game already has 4 players");
    return;
  }
  Teams.insert({ gid:gid, color:color });
  setupTeam(gid,color);  
  window.open("team/" + gid + "/" + color, "_blank");  
}});

// - - - - - - - - - - - - - - - - - - - - - - - -

Template.home.events({"click #dashboard":function() {
  window.open("dashboard/" + page.gid(), "_blank");    
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 
// slimed
//
var setupTeam = function(gid,teamColor) {
  var kanbanColor = teamColor;
  var oneColor    = teamColor;
  
  var makeKanban = function(kanbanSize, size, ones) {
    Kanbans.insert({ gid:gid,
                     teamColor:teamColor,
                     color:kanbanColor,
                     size:kanbanSize,
                     storySize:size,
                     ones:ones });    
  };
  makeKanban(1, 1, [ ]);
  makeKanban(3, 2, [oneColor,oneColor]);
  makeKanban(5, 5, [oneColor,"orange"]);
  makeKanban(3, 3, [oneColor,oneColor]);
  makeKanban(5, 0, [ ]);
  makeKanban(4, 4, [ ]);  
  makeKanban(1, 1, [oneColor]);
  makeKanban(1, 0, [ ]);
  
  _(6).times(function() {
      Dice.insert({ gid:gid, teamColor:teamColor, color:teamColor, value:rollDie() });
  });
};

