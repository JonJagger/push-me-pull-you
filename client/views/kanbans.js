
Template.kanbans.pullable = function() {
  return getKanbans(this.gid, this.color, 'pullable');
}

Template.kanbans.pushed = function() {
  return getKanbans(this.gid, this.color, 'pushed');
}

Template.kanbans.pushable = function() {
  return getKanbans(this.gid, this.color, 'pushable');
}

Template.kanbans.pulled = function() {
  return getKanbans(this.gid, this.color, 'pulled');
}

var getKanbans = function(gid,color,state) {
  return Kanbans.find({
    gid: gid,
    teamColor: color,
    state: state
  });    
}
