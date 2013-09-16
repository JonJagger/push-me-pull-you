
Template.edge.events({'click #roll' : function () {
  var ids = getDice(this.gid, this.teamColor).map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value: rollDie() }});
  });
}});

Template.edge.dice = function() {
  return getDice(this.gid, this.teamColor);
};

Template.edge.storiesQuarter = function(n) {
  var stories = Stories.find({ gid: this.gid, teamColor: this.teamColor }).fetch();
  var quarter = [ ];
  _.each(stories, function(story,index) {
    if (index % 4 == n) {
      quarter.push(story);
    }
  });  
  return quarter;
};

Template.edge.rendered = function () {  
  $('.one').draggable({
    start: function(event,ui) {
      var targets = $('.storyIsInProgress');
      targets.addClass('droppable')
             .droppable({ drop: oneDroppedOnKanban });      
    },
    stop: function(event,ui) {
      $('.storyIsInProgress').removeClass('droppable');
    },
    cursor: 'crosshair',
    stack: 'div',
    revert: true,
    revertDuration: 0,
    helper: 'original',
    opacity: 0.75
  });
  
  $('#wip .kanban.storyIsDone').draggable({
    start: function(event,ui) {
      $('#downstreamPortal').addClass('downstreamPortalDroppable');
      log($('.downstreamPortalDroppable').length);
      $('.downstreamPortalDroppable').droppable({
        drop: doneStoryDroppedOnDownstreamPortal
      });      
    },
    stop: function(event,ui) {
      $('#downstreamPortal').removeClass('downstreamPortalDroppable');
    },
    cursor: 'crosshair',
    stack: 'div',
    revert: true,
    revertDuration: 0,
    helper: 'original',
    opacity: 0.75
  });  
  
};

var oneDroppedOnKanban = function(event,ui) {
  var one = $(ui.draggable);  
  var story = $(this).story();
  Dice.update(one.id(), { $set: { value: 6 }});    
  var ones = story.ones();
  ones.unshift(one.color());
  Stories.update(story.id(), { $set: { ones: ones } });
};

var doneStoryDroppedOnDownstreamPortal = function(event,ui) {
  log("DROPPED");  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// slimed

Template.downstreamPortal.color = function() {
  if (this.teamColor === 'red')    return 'orange';
  if (this.teamColor === 'orange') return 'blue';
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// slimed

Template.upstreamPortal.color = function() {
  if (this.teamColor === 'red')    return 'backlog';
  if (this.teamColor === 'orange') return 'red';
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.story.kanbanState = function() {
  if (this.size === 0)
    return 'kanbanIsEmpty';
  if (this.ones.length < this.size)
    return 'storyIsInProgress';
  if (this.ones.length === this.size)
    return 'storyIsDone';
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

//Template.story.droppableKanban = function() {
//  return (this.size === 0 || this.ones.length !== this.size) ? 'droppable' : '';
//};

//Template.story.draggableKanban = function() {
//  return (this.ones.length === this.size) ? 'draggable' : '';
//};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

//Template.die.draggableOne = function() {
//  return isOne(this) ? 'draggableOne' : '';
//};

Template.die.one = function() {
  return isOne(this) ? 'one' : 'not-one';  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var log = function(msg,arg) {
  if (arg === undefined) {
    console.log(EJSON.stringify(msg));
  } else {
    console.log(msg + " = " + EJSON.stringify(arg));
  }
};

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
  return this.closest('#team');
};

$.fn.ones = function(/*story*/) {  
  var ones = $(this).data('ones');
  return (ones === '') ? [ ] : ones.split(',');  
};

$.fn.size = function(/*story*/) {
  return $(this).data('size');
};

$.fn.isDone = function(/*story*/) {
  return this.ones().length === this.size();
};        

$.fn.id = function() {
  return $(this).data('id');  
};

$.fn.color = function() {
  var element = this;
  return _.find(teamColors(), function(color) {
    return element.hasClass(color);
  });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*
var makeDraggable = function(nodes) {
  nodes.draggable({
    cursor: 'crosshair',
    stack: 'div',
    revert: true,
    revertDuration: 0,
    helper: 'original',
    opacity: 0.75
  });            
};

var makeDroppable = function() {
  $('.droppable').droppable({
    //accept: 'css' eg #id or .one
    hoverClass: 'hover',
    drop: dropHandler
  });
  
  $('.droppable.kanban').droppable({
    accept: '.draggable.one',
    hoverClass: 'hover',
    drop: oneDroppedOnKanban    
  });
  
  // You can't have two .droppables, the second one seems to cancel the first one
  // Starting to think that the best way is to hook into the drag and dynamically
  // figure out what the droppable is once the drag starts...
  
  $('.droppable.kanban').droppable({
    accept: '.draggable.kanban',
    hoverClass: 'hover',
    drop: kanbanDroppedOnKanban    
  });  
};

var dropHandler = function(event,ui) {
  var handler = newDropHandler($(ui.draggable), $(this));
  handler.dragDrop('kanban','downstream portal',kanbanDroppedOnDownstreamPortal);
  handler.dragDrop('kanban','upstream portal',kanbanDroppedOnUpstreamPortal);
  handler.dragDrop('kanban','kanban',kanbanDroppedOnKanban);
};

var newDropHandler = function(dragged,dropped) {
  return {
    dragDrop: function(from,to,f) {
      if (dragged.hasClass(from) && dropped.hasClass(to)) {
        f(dragged,dropped);
      }
    }
  }
};

var kanbanDroppedOnDownstreamPortal = function(kanban,portal) {
  var story = kanban.story();
  var fromColor = $(portal).data('from');
  var toColor = $(portal).data('to');  
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

var kanbanDroppedOnUpstreamPortal = function(kanban,portal) {
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
  var from = $(ui.draggable);
  var to = $(this);
  alert("[full?] kanban dropped onto [empty?] kanban");
};
*/



