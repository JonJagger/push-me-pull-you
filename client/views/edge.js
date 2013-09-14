
var edge = Template.edge;
var story = Template.story;

edge.stories = function() {
  return Stories.find({ gid: this.gid, color: this.color });
};

story.isNull = function() {
  return this.size === "0";
};

edge.rendered = function () {
  makeDraggable($('.draggable'));
  makeDroppable($('.droppable'));
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

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
  if (dragDrop(dragged, 'one', dropped, 'story')) {
    oneDroppedOnStory(dragged,dropped);
  }                
};

var oneDroppedOnStory = function(one,story) {
  var kanban = story.parent();
  if (!story.isDone() && kanban.color() === one.color()) {
    one.detach();
    story.addOne();
  }
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.hasClass = function(klass) {
  return this.attr('class').indexOf(klass) !== -1;
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
  return _.find(edgeColors(), function(color) {
    return element.hasClass(color);
  });
};

$.fn.addOne = function(/*story*/) {
  var ones = parseInt(this.ones(), 10);
  Stories.update(this.id(), { $set: { ones: ones+1 }});
};


