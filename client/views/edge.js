
var edge = Template.edge;
var story = Template.story;

edge.stories = function() {
  console.log("stories CALLED");
  return Stories.find({ gid: this.gid, color: this.color });
};

story.isNull = function() {
  return this.size === "0";
  //console.log("isNull() this.size==" + this.size + ", returning" + result);
};

edge.rendered = function () {
  makeDraggable($('.draggable'));
  makeDroppable($('.droppable'));
  //$('.story, .null-story').each(function() { $(this).display(); });
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
    drop: dropFn
  });            
};
        
var dropFn = function(event, ui) {
  var dragged = $(ui.draggable);
  var dropped = $(this);
  var draggedClass = dragged.attr('class');
  var droppedClass = dropped.attr('class');
  if (draggedClass.indexOf('one') !== -1) {
    if (droppedClass.indexOf('story') !== -1) {
      oneDroppedOnStory(dragged,dropped);
    }
  }                
};

var oneDroppedOnStory = function(one,story) {
  var kanban = story.parent();
  if (!story.isDone() && kanban.color() === one.color()) {
    one.detach();
    story.addOne();
  }
};

$.fn.getOnes = function(/*story*/) {
  return $(this).data('ones');
};

$.fn.getSize = function(/*story*/) {
  return $(this).data('size');
};

$.fn.display = function(/*story*/) {
  var size = this.getSize();
  if (size !== 0) {
    this.html(this.getOnes() + "-" + this.getSize());
  } else {
    this.html('&nbsp;');
  }
};

$.fn.isDone = function(/*story*/) {
  return this.getOnes() === this.getSize();
};        

$.fn.addOne = function(/*story*/) {
  var ones = parseInt(this.getOnes(), 10);
  var id = $(this).data('id');
  Stories.update(id, { $set: { ones: ones+1 }});
};

$.fn.color = function() {
  var klass = this.attr('class');
  return _.find(edgeColors(), function(color) {
    return klass.indexOf(color) !== -1;
  });
};


