
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
  // TODO: setup page offering
  //          wip limits?
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
  var gid = page.gid();
  var game = Games.findOne({ gid:gid });
  window.open("dashboard/" + gid, "_blank");    
}});

// - - - - - - - - - - - - - - - - - - - - - - - - 
// slimed
//
var setupTeam = function(gid,teamColor) {
  var kanbanColor = teamColor;
  var oneColor    = teamColor;
  
  var makeKanban = function(size, ones) {
    Kanbans.insert({ gid:gid,
                     teamColor:teamColor,
                     at:"wip",
                     color:kanbanColor,
                     size:size,
                     ones:ones });    
  };
  makeKanban(1, [ ]);
  makeKanban(5, [oneColor,oneColor]);
  makeKanban(3, [oneColor,oneColor,oneColor]);
  makeKanban(4, [ ]);  
  makeKanban(1, [oneColor]);
  
  makeKanban(0, [ ]);
};

