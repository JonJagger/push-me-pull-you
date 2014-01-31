
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
  Router.go('/' + game.gid);  
}});

// - - - - - - - - - - - - - - - - - - - - - - - -

Template.home.rendered = function() {
  enableDisableJoinDashboard();
}

// - - - - - - - - - - - - - - - - - - - - - - - -

Template.home.events({"keyup #gid":function() {
  enableDisableJoinDashboard();
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

var enableDisableJoinDashboard = function() {
  var gid = page.gid();
  if (!Games.findOne({ gid:gid })) {
    page.join().disable();
    page.dashboard().disable();
  } else {
    // TODO: if 4 teams already joined do not enable join
    page.join().enable();
    page.dashboard().enable();
  }    
}

// - - - - - - - - - - - - - - - - - - - - - - - - 

var setupTeam = function(gid,color) {
  newKanban(gid,color);
  newKanban(gid,color);
  newKanban(gid,color);
  newKanban(gid,color);
};

