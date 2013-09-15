
var edge = Template.edge;
var story = Template.story;

edge.stories = function() {
  return Stories.find({ gid: this.gid, teamColor: this.teamColor });
};

story.droppableKanban = function() {
  return (this.ones.length !== this.size) ? 'droppable' : '';
};

story.draggableKanban = function() {
  return (this.ones.length === this.size) ? 'draggable' : '';
};

story.gaps = function() { // see {{#each gaps}} in edge.html
  var n = this.size - this.ones.length;          // eg 3
  return _(n).times(function() { return 1; });   // eg [1,1,1]
};

story.ones = function() { // see {{#each ones}} in edge.html
  return this.ones;
};

edge.rendered = function () {
  makeDraggable($('.draggable'));
  makeDroppable($('.droppable'));
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

var makeDroppable = function(nodes) {
  nodes.droppable({
    hoverClass: 'hover',
    drop: dropHandler
  });            
};

var dropHandler = function(event,ui) {
  var handler = newDropHandler($(ui.draggable), $(this));
  handler.dragDrop('one','kanban',oneDroppedOnKanban);
  handler.dragDrop('kanban','downstream portal',kanbanDroppedOnDownstreamPortal);
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

var oneDroppedOnKanban = function(one,kanban) {
  var story = kanban.story();
  if (!story.isDone()) {
    one.detach();
    story.addOne(one.color());
  }
};

var kanbanDroppedOnDownstreamPortal = function(kanban,portal) {
  var story = kanban.story();
  var toColor = portal.attr('data-to');
  var fromColor = portal.attr('data-from');
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

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.hasClass = function(klass) {
  return this.attr('class').indexOf(klass) !== -1;
};

$.fn.story = function(/*kanban*/) {
  return $(this.children()[0]);
};

$.fn.ones = function(/*story*/) {  
  var ones = $(this).data('ones');
  return (ones === "") ? [ ] : ones.split(',');  
};

$.fn.size = function(/*story*/) {
  return $(this).data('size');
};

$.fn.isDone = function(/*story*/) {
  return this.ones().length === this.size();
};        

$.fn.id = function(/*story*/) {
  return $(this).data('id');  
};

$.fn.color = function() {
  var element = this;
  return _.find(teamColors(), function(color) {
    return element.hasClass(color);
  });
};

$.fn.addOne = function(/*story*/ color) {
  var ones = this.ones();
  ones.unshift(color);
  Stories.update(this.id(), {
    $set: { ones: ones }
  });
};


