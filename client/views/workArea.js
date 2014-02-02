
Template.workArea.pushedKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pushed'
  });  
}

Template.workArea.inProgressKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: { $in: [ 'pullable', 'pushable'] }
  });
}

Template.workArea.pulledKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pulled'
  });  
}

