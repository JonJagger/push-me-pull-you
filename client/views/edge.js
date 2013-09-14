
var edge = Template.edge;
var story = Template.story;

edge.stories = function() {
  return Stories.find({ gid: this.gid, teamColor: this.teamColor });
};

story.droppableKanban = function() {
  return (this.ones !== this.size) ? 'droppable' : '';
};

story.draggableKanban = function() {
  return (this.ones === this.size) ? 'draggable' : '';
};

story.isNull = function() {
  return this.size === 0;
};

story.gap = function() {
  return nOnes(this.size - this.ones); // see {{#each gap}} in edge.html
};

story.one = function() {
  return nOnes(this.ones); // see {{#each one}} in edge.html
};

edge.rendered = function () {
  makeDraggable($('.draggable'));
  makeDroppable($('.droppable'));
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var nOnes = function(n) {
  // nOnes(3) --> [ 1, 1, 1 ]
  return _(n).times(function() { return 1; });
};

var makeDraggable = function(nodes) {
  nodes.draggable({
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
    //accept: ...
    drop: dropHandler
  });            
};

var dragDrop = function(dragged, dragClass, dropped, dropClass) {
  return dragged.hasClass(dragClass) && dropped.hasClass(dropClass);
};

var dropHandler = function(event, ui) {
  var dragged = $(ui.draggable);
  var dropped = $(this);
  
  if (dragDrop(dragged, 'one', dropped, 'kanban')) {
    oneDroppedOnKanban(dragged,dropped);
  }
  else if (dragDrop(dragged, 'kanban', dropped, 'downstream portal')) {
    kanbanDroppedOnDownstreamPortal(dragged, dropped);
  }
  
};

var oneDroppedOnKanban = function(one,kanban) {
  var story = kanban.story();
  if (!story.isDone() && kanban.color() === one.color()) {
    one.detach();
    story.addOne();
  }
};

var kanbanDroppedOnDownstreamPortal = function(kanban,portal) {
  var story = kanban.story();
  var toColor = portal.attr('data-to');
  var fromColor = portal.attr('data-from');
  if (story.isDone()) {
    if (kanban.color() === fromColor) { // pushing a done kanban
      Stories.update(story.id(), { $set: {
        ones: 0,
        teamColor: toColor,
        kanbanColor: toColor
      }});
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

$.fn.isDone = function(/*story*/) {
  return this.ones() === this.size();
};        

$.fn.ones = function(/*story*/) {
  return $(this).data('ones');
};

$.fn.size = function(/*story*/) {
  return $(this).data('size');
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

$.fn.addOne = function(/*story*/) {
  var ones = parseInt(this.ones(), 10);
  Stories.update(this.id(), { $set: { ones: ones+1 }});
};


