
var edge = Template.edge;

edge.gid = function() {
  return this.gid;  
};

edge.colour = function() {
  return this.colour;
};

edge.stories = function() {
  return Stories.find({ gid: this.gid, colour: this.colour });
};

edge.rendered = function () {
  makeDraggable($('.draggable'));
  makeDroppable($('.droppable'));
  $('.story, .null-story').each(function() { $(this).display(); });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
        
var dropFn = function(event, ui) {
  // TODO
};

$.fn.getOnes = function() {
  return this.attr('ones').length;
};

$.fn.getSize = function() {
  return this.attr('size').length;
};

$.fn.display = function(/*story*/) {
  this.html(this.getOnes() + "-" + this.getSize());
};

var makeDraggable = function(nodes) {
    nodes.draggable({
        stack: "div",
        revert: true,
        revertDuration: 0,
        helper: 'original',
        opacity: 0.75                        
    });            
};

var makeDroppable = function(nodes) {
  nodes.droppable({
    hoverClass: "hover",
    //accept: ...
    drop: dropFn
  });            
};

