
var edge  = Template.edge;
var die   = Template.die;
var story = Template.story;

edge.events({'click #roll' : function () {
  var dice = Dice.find({ gid: this.gid, teamColor: this.teamColor });
  var ids = dice.map(function(die) { return die._id; });  
  _.each(ids, function(id) {
    Dice.update(id, { $set: { value: rollDie() }});
  });
}});

edge.dice = function() {
  return Dice.find({ gid: this.gid, teamColor: this.teamColor });  
};

edge.stories = function() {
  return Stories.find({ gid: this.gid, teamColor: this.teamColor });
};

edge.downstreamPortalColor = function() {
  if (this.teamColor === 'red')    return 'orange';
  if (this.teamColor === 'orange') return 'blue';
};

edge.upstreamPortalColor = function() {
  if (this.teamColor === 'red')    return 'backlog';
  if (this.teamColor === 'orange') return 'red';
};

story.droppableKanban = function() {
  return (this.size === 0 || this.ones.length !== this.size) ? 'droppable' : '';
};

story.oneDroppable = function() {
  var result = this.size !== 0 && this.ones.length < this.size ? 'oneDroppable' : '';
  console.log('oneDroppable==' + result);
  return result;
};

story.draggableKanban = function() {
  return (this.ones.length === this.size) ? 'draggable' : '';
};

var nOnes = function(n) { // eg 3
  return _(n).times(function() { return 1; });  // eg [1,1,1]
};

story.holes = function() { // see {{#each holes}} in edge.html
  return nOnes(this.kanbanSize - this.size);
};

story.gaps = function() { // see {{#each gaps}} in edge.html
  return nOnes(this.size - this.ones.length);
};

story.ones = function() { // see {{#each ones}} in edge.html
  return this.ones; // eg ['red','red','blue']
};

var isOne = function(die) {
  return die.value === 1;  
};

die.draggableOne = function() {
  return isOne(this) ? 'draggableOne' : '';
};

die.draggable = function() {
  return isOne(this) ? 'draggable' : '';
};

die.one = function() {
  return isOne(this) ? 'one' : 'not-one';  
};

edge.rendered = function () {
  //makeDraggable($('.draggable'));
  //makeDroppable(); //$('.droppable'));
  
  $('.draggableOne').draggable({
    drag: function(event,ui) {
      //ui.helper is being dragged
      console.log("SET droppable to kanban");      
      console.log("  BEFORE: $('.oneDroppable').length==" + $('.oneDroppable').length);
      console.log("  BEFORE: $('.oneDroppableYes').length==" + $('.oneDroppableYes').length);
      $('.oneDroppable').addClass('oneDroppableYes');
      console.log("   AFTER: $('.oneDroppable').length==" + $('.oneDroppable').length);
      console.log("   AFTER: $('.oneDroppableYes').length==" + $('.oneDroppableYes').length);
      
      $('.oneDroppableYes').droppable({
        //accept: '.draggable.one',
        //hoverClass: 'oneDroppableYesHover',
        drop: oneDroppedOnKanban    
      });      
    },
    stop: function(event,ui) {
      console.log("UNSET droppable to kanban");
      console.log("  BEFORE: $('.oneDroppable').length==" + $('.oneDroppable').length);
      console.log("  BEFORE: $('.oneDroppableYes').length==" + $('.oneDroppableYes').length);
      $('.oneDroppable').removeClass('oneDroppableYes');
      console.log("   AFTER: $('.oneDroppable').length==" + $('.oneDroppable').length);
      console.log("   AFTER: $('.oneDroppableYes').length==" + $('.oneDroppableYes').length);
    },
    cursor: 'crosshair',
    stack: 'div',
    revert: true,
    revertDuration: 0,
    helper: 'original',
    opacity: 0.75
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
*/

/*
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
*/

var oneDroppedOnKanban = function(event,ui) {
  console.log("oneDroppedOnKanban");
  var one = $(ui.draggable);
  var kanban = $(this);
  
  var story = kanban.story();
  //if (!story.isDone()) {    
    Dice.update(one.id(), { $set: { value: 6 }});    
    var ones = story.ones();
    ones.unshift(one.color());
    Stories.update(story.id(), { $set: { ones: ones } });
  //}
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


