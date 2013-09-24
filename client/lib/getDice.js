
getDice = function(gid, teamColor) {
  return Dice.find({ gid:gid, teamColor:teamColor });    
};
