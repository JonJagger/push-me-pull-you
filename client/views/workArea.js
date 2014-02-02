
Template.workArea.inProgressKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: { $in: [ 'pullable', 'in-progress', 'pushable'] }
  });
}

Template.workArea.pulledKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pulled'
  });  
}

Template.workArea.pushedKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pushed'
  });  
}