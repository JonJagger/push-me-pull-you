
Template.wip.kanbans = function() {
  return getKanbansIn(this.gid, this.color, "wip");  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.upstreamPortal.kanbans = function() {
  return getKanbansIn(this.gid, this.color, "upstream");  
};

Template.upstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "backlog";
  if (this.color === "orange") return "red";
  if (this.color === "blue"  ) return "orange";
  if (this.color === "green" ) return "blue";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.downstreamPortal.kanbans = function() {
  return getKanbansIn(this.gid, this.color, "downstream");  
};

Template.downstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "orange";
  if (this.color === "orange") return "blue";
  if (this.color === "blue"  ) return "green";
  if (this.color === "green" ) return "done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.team.rendered = function() {
  var team = $(".team");
  var color = team.color();
  setupDragDrop(color);
  
  $('.die.not-one').bind('click keyup', function(event) {
    var kanban = $(this).closest(".kanban");
    var ones   = kanban.ones();
    ones.unshift(kanban.color());  
    Kanbans.update(kanban.id(), { $set: { ones:ones } });  
  });
  
  color = color.charAt(0).toUpperCase() + color.slice(1);
  favIcon(document, 'http://www.jaggersoft.com/' + color + 'One.png');
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var getKanbansIn = function(gid,teamColor,where) {
  return Kanbans.find({ gid:gid, teamColor:teamColor, at:where });    
};

var isOne = function(die) {
  return die.value === 1;  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.hasClass = function(klass) {
  return this.attr("class").indexOf(klass) !== -1;
};

$.fn.team = function() {
  return this.closest(".team");
};

$.fn.ones = function(/*kanban*/) {  
  var ones = $(this).data("ones");
  // see Template.kanban.onesColors() HACK
  return (ones === ",") ? [ ] : ones.split(",");
};

$.fn.id = function() {
  return $(this).data("id");  
};

$.fn.color = function() {
  var node = this;
  return _.find(teamColors(), function(color) {
    return node.hasClass(color);
  });
};



