
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

Template.wip.storiesColumn = function(n) {
  // Each quarter goes into a <td> so there is no vertical gap between kanbans 
  var stories = Stories.find({ gid:this.gid, teamColor:this.color }).fetch();
  var column = [ ];
  _.each(stories, function(story,index) {
    if (index % 3 == n) {
      column.push(story);
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
  dragDropSetup(".wip .kanban.story-is-done",
                ".board .downstream.portal",
                doneStoryDroppedOnDownstreamPortal);
  
  // TODO Pulling[on]
  //
  dragDropSetup(".wip .kanban.is-empty",
                ".board .upstream.portal",
                emptyKanbanDroppedOnUpstreamPortal);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var dragDropSetup = function(from,to,handler) {
  var droppables = function(event) {
      var dragged = $(event.target);
      var css  = ".team." + dragged.team().color() + " " + to;
      return $(css);
  };
  $(from).draggable({
    start:function(event,ui) {
      droppables(event).addClass("droppable")
                       .droppable({ drop:handler });      
    },
    stop:function(event,ui) {
      droppables(event).removeClass("droppable");
    },
    stack:"div",
    revert:true,
    revertDuration: 0,
    helper:"original",
    opacity:0.75
  });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var oneDroppedOnKanban = function(event,ui) {
  var one    = ui.draggable;
  var kanban = $(this);
  var story  = kanban.story();
  var ones   = story.ones();
  var anythingButOne = 6;
  Dice.update(one.id(), { $set: { value:anythingButOne }});
  ones.unshift(one.color());  
  Stories.update(story.id(), { $set: { ones:ones } });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneStoryDroppedOnDownstreamPortal = function(event,ui) {
  var kanban    = ui.draggable; 
  var portal    = $(this);
  var story     = kanban.story();  
  var fromColor = portal.team().color();
  var toColor   = portal.data("to-team");  
  if (story.isDone()) {
    if (kanban.color() === fromColor) { // push
      Stories.update(story.id(), {
        $set: {
          ones:[ ],
          teamColor:toColor,
          kanbanColor:toColor
        }
      });
    }
  }
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var emptyKanbanDroppedOnUpstreamPortal = function(event,ui) {
    
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.downstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "blue";
  if (this.color === "blue"  ) return "orange";
  if (this.color === "orange") return "green";
  if (this.color === "green" ) return "done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.upstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "backlog";
  if (this.color === "blue"  ) return "red";
  if (this.color === "orange") return "blue";
  if (this.color === "green" ) return "orange";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.story.kanbanState = function() {
  if (this.size === 0)
    return "is-empty";
  if (this.ones.length < this.size)
    return "story-is-in-progress";
  if (this.ones.length === this.size)
    return "story-is-done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.story.holes = function() { // see {{#each holes}} in team.html
  return nOnes(this.kanbanSize - this.size);
};

Template.story.gaps = function() { // see {{#each gaps}} in team.html
  return nOnes(this.size - this.ones.length);
};

Template.story.ones = function() { // see {{#each ones}} in team.html
  return this.ones; // eg ['red','red','blue']
};

Template.story.doneOne = function() {
  return "8226"; // bullet
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

$.fn.story = function(/*kanban*/) {
  return $(this.children()[0]);
};

$.fn.team = function(/*kanban*/) {
  return this.closest(".team");
};

$.fn.ones = function(/*story*/) {  
  var ones = $(this).data("ones");
  return (ones === "") ? [ ] : ones.split(",");  
};

$.fn.size = function(/*story*/) {
  return $(this).data("size");
};

$.fn.isDone = function(/*story*/) {
  return this.ones().length === this.size();
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



