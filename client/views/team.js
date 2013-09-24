
Template.team.events({"click #roll":function () {
  var ids = getDice(this.gid, this.color).map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value:rollDie() }});
  });
}});

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.dice.rolled = function() {
  return getDice(this.gid, this.color);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.wip.kanbansColumn = function(n) {
  return getKanbans(this.gid, this.color, "wip", n);  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.upstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "backlog";
  if (this.color === "orange") return "red";
  if (this.color === "blue"  ) return "orange";
  if (this.color === "green" ) return "blue";
};


Template.upstreamPortal.kanbansColumn = function(n) {
  return getKanbans(this.gid, this.color, "upstream", n);    
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.downstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "orange";
  if (this.color === "orange") return "blue";
  if (this.color === "blue"  ) return "green";
  if (this.color === "green" ) return "done";
};

Template.downstreamPortal.kanbansColumn = function(n) {
  return getKanbans(this.gid, this.color, "downstream", n);      
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.kanban.state = function() {
  if (this.storySize === 0)
    return "is-empty";
  if (this.ones.length < this.storySize)
    return "story-is-in-progress";
  if (this.ones.length === this.storySize)
    return "story-is-done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// If a kanban's size is 5 and it contains a story whose
// size is 5 then it has no holes.
// If a kanban's size is 5 and it contains a story whose
// size is 4 then it has one hole.
// Experimental. Not sure if this is valuable enough to keep.
// see {{#each holes}} in team.html
//
Template.kanban.holes = function() {
  return nOnes(this.size - this.storySize);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// If a story's size is 4 and it has had 4 ones played
// on it then it has no gaps.
// If a story's size is 4 and it has had 3 ones played
// on it then it has one gap.
// see {{#each gaps}} in team.html
//
Template.kanban.gaps = function() {
  return nOnes(this.storySize - this.ones.length);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// The number of ones that have been played on a story.
// see {{#each ones}} in team.html
//
Template.kanban.ones = function() {
  return this.ones; // eg ['red','red','blue']
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.die.one = function() {
  return isOne(this) ? "one" : "not-one";  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.team.rendered = function() {
  // Play a [1]
  dragDropSetup(".dice .die.one",
                ".wip .kanban.story-is-in-progress",
                oneDroppedOnKanban);
  
  // TODO: Pushing[on]
  //
  dragDropSetup(".wip .kanban.story-is-done",
                ".downstream.portal",
                doneKanbanDroppedOnDownstreamPortal);
  dragDropSetup(".upstream.portal .kanban.story-is-done",
                ".wip", // TODO: fix weird z-index effect here
                doneKanbanDroppedOnWip);
  
  // TODO Pulling[on]
  //
  
  dragDropSetup(".wip .kanban.is-empty",
                ".upstream.portal",
                emptyKanbanDroppedOnUpstreamPortal);
  
  // .wip .kanban.story-is-done
  // .downstream.portal .kanban.is-empty
  // AND the sizes match...
  // how to check for that?
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var dragDropSetup = function(from,to,handler) {
  var droppables = function(event) {
      return $(to, $(event.target).team());
  };
  $(from).draggable({
    start:function(event,ui) {
      droppables(event).addClass("droppable")
                       .droppable({ drop:handler });      
    },
    stop:function(event,ui) {
      droppables(event).removeClass("droppable");
    },
    revert:true,
    revertDuration: 0,
    opacity:0.75
  });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var oneDroppedOnKanban = function(event,ui) {
  var one    = ui.draggable;
  var kanban = $(this);
  var ones   = kanban.ones();
  var anythingButOne = 6;
  Dice.update(one.id(), { $set: { value:anythingButOne }});
  ones.unshift(one.color());  
  Kanbans.update(kanban.id(), { $set: { ones:ones } });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneKanbanDroppedOnDownstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var downstreamColor = portal.data("to-team");
  Kanbans.update(kanban.id(), { // push
    $set: {
      teamColor:downstreamColor,
      at:"upstream"
    }
  });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var emptyKanbanDroppedOnUpstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var upstreamColor = portal.data("to-team");
  Kanbans.update(kanban.id(), { // pull-request
    $set: {
      teamColor:upstreamColor,
      at:"downstream"
    }
  });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneKanbanDroppedOnWip = function(event, ui) {
  var kanban = ui.draggable; 
  var wip    = $(this);
  var toColor = wip.team().color();
  Kanbans.update(kanban.id(), { 
    $set: {
      ones:[ ],
      color:toColor, 
      at:"wip"    
    }
  });    
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var getKanbans = function(gid,teamColor,at,n) {
  // Each column goes into a <td> so there are no horizontal gaps between kanbans
  // TODO: Kanbans.find() is called once per column - find a way to call it once
  //       and pass the collection as an argument.
  var kanbans = Kanbans.find({ gid:gid, teamColor:teamColor, at:at }).fetch();
  var column = [ ];
  _.each(kanbans, function(kanban,index) {
    if (index % 4 === n) {
      column.push(kanban);
    }
  });
  return column;  
};

var getDice = function(gid, teamColor) {
  return Dice.find({ gid:gid, teamColor:teamColor });    
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
  return (ones === "") ? [ ] : ones.split(",");  
};

$.fn.storySize = function(/*kanban*/) {
  return $(this).data("story-size");
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



