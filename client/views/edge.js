
var edge = Template.edge;

edge.stories = function() {
  var result = Stories.find({ gid: this.gid, colour: this.colour });
  console.log(EJSON.stringify(result));
  return result;
};

edge.rendered = function () {
  makeDraggable($('.draggable'));
  makeDroppable($('.droppable'));
  $('.story, .null-story').each(function() { $(this).display(); });
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
  if (!story.isDone() && kanban.colour() === one.colour()) {
    one.detach();
    story.addOne();
  }
};

$.fn.getOnes = function() {
  return this.attr('data-ones').length;
};

$.fn.getSize = function() {
  return this.attr('data-size').length;
};

$.fn.display = function(/*story*/) {
  this.html(this.getOnes() + "-" + this.getSize());
};

$.fn.isDone = function() {
  return this.getOnes() === this.getSize();
};        

$.fn.addOne = function() {
  this.attr('data-ones', this.attr('data-ones') + '1');                    
  var id = $(this).data('id');
  //TODO: update it instead
  Stories.remove(id);  // this updates on other browsers :-)
};

$.fn.colour = function() {
  var element = this;
  return _.find(['red','orange','blue','green'], function(colour) {
    return element.attr('class').indexOf(colour) !== -1;
  });
};


