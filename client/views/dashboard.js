
var reactiveTeam = function(gid, teamColor) {
  return Template["edge"]({ gid: gid, teamColor: teamColor });  
};

Template.dashboard.redTeam = function() {
  return reactiveTeam(this.gid, "red");
};

Template.dashboard.orangeTeam = function() {
  return reactiveTeam(this.gid, "orange");
};

Template.dashboard.blueTeam = function() {
  return reactiveTeam(this.gid, "blue");
};

Template.dashboard.greenTeam = function() {
  return reactiveTeam(this.gid, "green");
};