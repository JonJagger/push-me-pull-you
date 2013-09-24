
Template.roll.events({"click #roll":function () {
  log("roll=this.gid", this.gid);
  log("roll=this.color", this.color);
  var ids = getDice(this.gid, this.color).map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value:rollDie() }});
  });
}});

var getDice = function(gid, teamColor) {
  return Dice.find({ gid:gid, teamColor:teamColor });    
};
