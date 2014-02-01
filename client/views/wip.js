
Template.wip.kanbans = function() {
  return Kanbans.find({ gid:this.gid, teamColor:this.color });      
};

