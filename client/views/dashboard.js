
Template.dashboard.id = function() {
  log("inside Template.review.id");  
  return this.gid;
};

Template.dashboard.redTeam = function() {
  return Template["edge"]({ gid: this.gid, teamColor: "red" });
};

Template.dashboard.orangeTeam = function() {
  return Template["edge"]({ gid: this.gid, teamColor: "orange" });
};

Template.dashboard.blueTeam = function() {
  return Template["edge"]({ gid: this.gid, teamColor: "blue" });
};

Template.dashboard.greenTeam = function() {
  return Template["edge"]({ gid: this.gid, teamColor: "green" });
};