
Template.makeNewKanban.count = function() {
  return Kanbans.find({gid:this.gid, teamColor:this.color}).count();
}

Template.makeNewKanban.events({"click input":function() {
  newKanban(this.gid, this.color);
}});

