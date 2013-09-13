
var edge = Template.edge;

edge.gid = function() {
  return this.gid;  
};

edge.colour = function() {
  return this.colour;
};

edge.stories = function() {
  return Edges.findOne({ gid: this.gid, colour: this.colour }).stories;  
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
  var team = this.parent().parent().attr('id');
  if (team === 'backlog' || team === 'done') {
    this.html(this.getSize());
  } else {
    this.html(this.getOnes() + "-" + this.getSize());
  }
  return this;
};

var makeDraggable = function(nodes) {
    return nodes.draggable({
        stack: "div",
        revert: true,
        revertDuration: 0,
        helper: 'original',
        opacity: 0.75                        
    });            
};

var makeDroppable = function(nodes) {
  return nodes.droppable({
    hoverClass: "hover",
    //accept: ...
    drop: dropFn
  });            
};

