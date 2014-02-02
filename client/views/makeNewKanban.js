
Template.makeNewKanban.count = function() {
  return Kanbans.find({gid:this.gid, color:this.color}).count();
}

Template.makeNewKanban.events({"click input":function() {
  newKanban(this.gid, this.color);
}});

