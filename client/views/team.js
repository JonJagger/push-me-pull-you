
Template.dice.rolled = function() {
  return getDice(this.gid, this.color);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

Template.kanban.state = function() {
  if (this.ones.length === 0)
    return "is-empty is-in-progress";
  if (this.ones.length < this.size)
    return "is-in-progress";
  if (this.ones.length === this.size)
    return "is-done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// If a story's size is 4 and it has had 4 ones played
// on it then it has no gaps.
// If a story's size is 4 and it has had 3 ones played
// on it then it has one gap.
// see {{#each gaps}} in kanban.html
//
Template.kanban.gaps = function() {
  return nOnes(this.size - this.ones.length);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// The number of ones that have been played on a story.
// see kanban.html
//

Template.kanban.onesColors = function() {
  if (this.ones == "") {
    return ","; // HACK, returning "" causes kanban.html to emit ...data-ones>
  } else {                         // rather than ...data-ones="">
    return this.ones;              // and I don't know why
  }
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.die.one = function() {
  return isOne(this) ? "one" : "not-one";  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.team.rendered = function() {
  var team = $(".team");
  var color = team.color();
  setupDragDrop(team.data("mode"), color);    
  color = color.charAt(0).toUpperCase() + color.slice(1);
  favIcon(document, 'http://www.jaggersoft.com/' + color + 'One.png');
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var getKanbansIn = function(gid,teamColor,where) {
  return Kanbans.find({ gid:gid, teamColor:teamColor, at:where });    
};

var nOnes = function(n) { // eg 3
  return _(n).times(function() { return 1; });  // eg [1,1,1]
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



