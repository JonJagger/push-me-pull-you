
newKanban = function(gid,color) {
  Kanbans.insert({ gid:gid,
                   teamColor:color,
                   color:color,
                   state: 'pullable',
                   size:0,
                   ones:[ ] });
};