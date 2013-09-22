
Template.team.events({"click #roll":function () {
  var ids = getDice(this.gid, this.color).map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value:rollDie() }});
  });
}});

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.team.dice = function() {
  return getDice(this.gid, this.color);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.wip.kanbansColumn = function(n) {
  // Each column goes into a <td> so there are no horizontal gaps between kanbans 
  var kanbans = Kanbans.find({ gid:this.gid, teamColor:this.color }).fetch();
  var column = [ ];
  _.each(kanbans, function(kanban,index) {
    if (index % 4 === n) {
      column.push(kanban);
    }
  });
  return column;
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.team.rendered = function() {  
  dragDropSetup(".dice .die.one",
                ".wip .kanban.story-is-in-progress",
                oneDroppedOnKanban);
  
  // TODO: Pushing[on]
  //
  dragDropSetup(".kanban.story-is-done",
                ".downstream.portal",
                doneKanbanDroppedOnDownstreamPortal);
  
  // TODO Pulling[on]
  //
  dragDropSetup(".kanban.is-empty",
                ".upstream.portal",
                emptyKanbanDroppedOnUpstreamPortal);
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
  var kanban    = ui.draggable; 
  var portal    = $(this);
  var fromColor = portal.team().color();
  var toColor   = portal.data("to-team");
  if (kanban.color() === fromColor) { // push
    Kanbans.update(kanban.id(), {
      $set: {
        ones:[ ],
        teamColor:toColor,
        color:toColor
      }
    });
  }
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var emptyKanbanDroppedOnUpstreamPortal = function(event,ui) {
    
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.downstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "orange";
  if (this.color === "orange") return "blue";
  if (this.color === "blue"  ) return "green";
  if (this.color === "green" ) return "done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.upstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "backlog";
  if (this.color === "orange") return "red";
  if (this.color === "blue"  ) return "orange";
  if (this.color === "green" ) return "blue";
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
  var element = this;
  return _.find(teamColors(), function(color) {
    return element.hasClass(color);
  });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*
var emptyKanbanDroppedOnUpstreamPortal = function(kanban,portal) { // PULL
  var story = kanban.story();
  var toColor = $(portal).data('to');
  if (story.size() === 0) {
    if (kanban.team().color() === kanban.color()) {
      Stories.update(story.id(), {
        $set: {
          teamColor:toColor
        }
      });      
    }
  }
};

var kanbanDroppedOnKanban = function(event,ui) {
  // xfer full kanban to pull requested empty kanban
  var from = $(ui.draggable);
  var to = $(this);
  alert("[full?] kanban dropped onto [empty?] kanban");
};
*/



