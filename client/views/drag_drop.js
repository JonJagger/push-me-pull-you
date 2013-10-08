
setupDragDrop = function(mode,color) {
  // Play a [1]
  dragDropSetup(color,
                ".dice .die.one",
                ".wip .kanban.story-is-in-progress",
                oneDroppedOnKanban);

  if (mode === "push") {
    dragDropSetup(color,
                  ".wip .kanban.story-is-done",
                  ".downstream.portal",
                  doneKanbanDroppedOnDownstreamPortal);
    dragDropSetup(color,
                  ".upstream.portal .kanban.story-is-done",
                  ".wip",
                  doneKanbanDroppedOnWip);
  }
  if (mode === "pull") {    
    dragDropSetup(color,
                  ".wip .kanban.is-empty",
                  ".upstream.portal",
                  emptyKanbanDroppedOnUpstreamPortal);
  }
  // .wip .kanban.story-is-done
  // .downstream.portal .kanban.is-empty
  // AND the sizes match...
  // how to check for that?  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var dragDropSetup = function(color,from,to,handler) {
  var teamify = function(css) {
    return "."+color + ".team" + " " + css;
  };
  var droppables = function(event) {
      return $(teamify(to));
  };  
  $(teamify(from)).draggable({
    start:function(event,ui) {
      droppables(event).addClass("droppable")
                       .droppable({ drop:handler });      
    },
    stop:function(event,ui) {
      droppables(event).removeClass("droppable");
    },
    revert:true,
    revertDuration:0,
    opacity:0.75,
    zIndex:100
  });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var oneDroppedOnKanban = function(event,ui) {
  var one    = ui.draggable;
  var kanban = $(this);
  var ones   = kanban.ones();
  var anythingButOne = 6;
  Dice.update(one.id(), { $set: { value:anythingButOne }});
  ones.unshift(one.color());  
  Kanbans.update(kanban.id(), { $set: { ones:ones } });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneKanbanDroppedOnDownstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var downstreamColor = portal.data("to-team");
  Kanbans.update(kanban.id(), { // push
    $set: {
      teamColor:downstreamColor,
      at:"upstream"
    }
  });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var emptyKanbanDroppedOnUpstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var upstreamColor = portal.data("to-team");
  Kanbans.update(kanban.id(), { // pull-request
    $set: {
      teamColor:upstreamColor,
      at:"downstream"
    }
  });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneKanbanDroppedOnWip = function(event, ui) {
  var kanban = ui.draggable; 
  var wip    = $(this);
  var toColor = wip.team().color();
  Kanbans.update(kanban.id(), { 
    $set: {
      ones:[ ],
      color:toColor, 
      at:"wip"    
    }
  });    
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var nOnes = function(n) { // eg 3
  return _(n).times(function() { return 1; });  // eg [1,1,1]
};

var isOne = function(die) {
  return die.value === 1;  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.hasClass = function(klass) {
  return this.attr("class").indexOf(klass) !== -1;
};

$.fn.team = function() {
  return this.closest(".team");
};

$.fn.ones = function(/*kanban*/) {  
  var ones = $(this).data("ones");
  return (ones === "") ? [ ] : ones.split(",");  
};

$.fn.storySize = function(/*kanban*/) {
  return $(this).data("story-size");
};

$.fn.id = function() {
  return $(this).data("id");  
};

$.fn.color = function() {
  var node = this;
  return _.find(teamColors(), function(color) {
    return node.hasClass(color);
  });
};



