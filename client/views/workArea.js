
Template.workArea.pullableKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pullable'
  });  
}

Template.workArea.pushedKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pushed'
  });  
}

Template.workArea.pushableKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pushable'
  });
}

Template.workArea.pulledKanbans = function() {
  return Kanbans.find({
    gid: this.gid,
    teamColor: this.color,
    state: 'pulled'
  });  
}

