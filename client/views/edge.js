
Template.edge.events({"click #roll" : function () {
  var ids = getDice(this.gid, this.teamColor).map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value: rollDie() }});
  });
}});

Template.edge.dice = function() {
  return getDice(this.gid, this.teamColor);
};

Template.edge.storiesQuarter = function(n) {
  // Each quarter goes into a <td> so there is no vertical gap between kanbans 
  var stories = Stories.find({ gid: this.gid, teamColor: this.teamColor }).fetch();
  var quarter = [ ];
  _.each(stories, function(story,index) {
    if (index % 4 == n) {
      quarter.push(story);
    }
  });
  return quarter;
};

Template.edge.rendered = function() {  
  dragDropSetup("#dice .die.one",
                "#wip .kanban.storyIsInProgress",
                oneDroppedOnKanban);
  
  // TODO: Pushing[on]
  //
  // log('teamColor',this.teamColor); // undefined?
  //
  //            "#wip .red.kanban.storyIsDone"    (for red team)
  dragDropSetup("#wip .kanban.storyIsDone",
                "#downstreamPortal",
                doneStoryDroppedOnDownstreamPortal);
  
  // TODO Pulling[on]
  //
  //            "#team-red .kanban.isEmpty"  (for red team)
  dragDropSetup("#wip .kanban.isEmpty",
                "#upstreamPortal",
                emptyKanbanDroppedOnUpstreamPortal);
  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var dragDropSetup = function(from,to,handler) {
  $(from).draggable({
    start: function(event,ui) {
      var targets = $(to);
      targets.addClass("droppable")
             .droppable({ drop: handler });      
    },
    stop: function(event,ui) {
      $(to).removeClass("droppable");
    },
    stack: "div",
    revert: true,
    revertDuration: 0,
    helper: "original",
    opacity: 0.75
  });  
};

var oneDroppedOnKanban = function(event,ui) {
  var one = ui.draggable;
  var kanban = $(this);
  var story = kanban.story();
  Dice.update(one.id(), { $set: { value: 6 }});    
  var ones = story.ones();
  ones.unshift(one.color());
  Stories.update(story.id(), { $set: { ones: ones } });
};

var doneStoryDroppedOnDownstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var story = kanban.story();  
  var fromColor = portal.data("from-color");
  var toColor = portal.data("to-color");  
  if (story.isDone()) {
    if (kanban.color() === fromColor) { // push
      Stories.update(story.id(), {
        $set: {
          ones: [ ],
          teamColor: toColor,
          kanbanColor: toColor
        }
      });
    }
  }
};

var emptyKanbanDroppedOnUpstreamPortal = function(event,ui) {
  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.downstreamPortal.toColor = function() {
  if (this.teamColor === "red")    return "orange";
  if (this.teamColor === "orange") return "blue";
  if (this.teamColor === "blue")   return "green";
  if (this.teamColor === "green")  return "done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.upstreamPortal.toColor = function() {
  if (this.teamColor === "red")    return "backlog";
  if (this.teamColor === "orange") return "red";
  if (this.teamColor === "blue")   return "orange";
  if (this.teamColor === "green")  return "blue";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.story.kanbanState = function() {
  if (this.size === 0)
    return "isEmpty";
  if (this.ones.length < this.size)
    return "storyIsInProgress";
  if (this.ones.length === this.size)
    return "storyIsDone";
};

Template.story.holes = function() { // see {{#each holes}} in edge.html
  return nOnes(this.kanbanSize - this.size);
};

Template.story.gaps = function() { // see {{#each gaps}} in edge.html
  return nOnes(this.size - this.ones.length);
};

Template.story.ones = function() { // see {{#each ones}} in edge.html
  return this.ones; // eg ['red','red','blue']
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.die.one = function() {
  return isOne(this) ? "one" : "not-one";  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var getDice = function(gid, teamColor) {
  return Dice.find({ gid: gid, teamColor: teamColor });    
};

var nOnes = function(n) { // eg 3
  return _(n).times(function() { return 1; });  // eg [1,1,1]
};

var isOne = function(die) {
  return die.value === 1;  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.hasClass = function(klass) {
  return this.attr('class').indexOf(klass) !== -1;
};

$.fn.story = function(/*kanban*/) {
  return $(this.children()[0]);
};

$.fn.team = function(/*kanban*/) {
  return this.closest("#team");
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
          teamColor: toColor
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



