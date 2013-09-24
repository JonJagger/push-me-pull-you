
Template.roll.events({"click #roll":function () {
  var ids = getDice(this.gid, this.color).map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value:rollDie() }});
  });
}});
