
setupDragDrop = function(color) {

  //if (mode === "push") {
    dragDropSetup(color,
                  ".wip .kanban.is-done",
                  ".downstream.portal",
                  doneKanbanDroppedOnDownstreamPortal);
    
    //dragDropSetup(color,
    //              ".upstream.portal .kanban.is-done",
    //              ".wip",
    //              doneKanbanDroppedOnWip);
  //}
  //if (mode === "pull") {    
    dragDropSetup(color,
                  ".wip .kanban.pullable",
                  ".upstream.portal",
                  emptyKanbanDroppedOnUpstreamPortal);
    // Note that in mode==push there is also a drag for
    //           .wip .kanban.story-is-done
    //           which means you cannot have push and pull active at
    //           the same time as the latter drag cancels the former.
    
    //dragDropSetup(color,
    //              ".wip .kanban.is-done",
    //              ".downstream.portal .kanban",
    //              doneKanbanDroppedOnEmptyKanban);
    
  //}
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

var doneKanbanDroppedOnDownstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var downstreamColor = portal.data("to-team");
  Kanbans.update(kanban.id(), { // push
    $set: {
      teamColor:downstreamColor,
      at:"wip"
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
      at:"wip"
    }
  });  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

//var doneKanbanDroppedOnWip = function(event, ui) {
//  var kanban = ui.draggable; 
//  var wip    = $(this);
//  var toColor = wip.team().color();
//  Kanbans.update(kanban.id(), { 
//    $set: {
//      ones:[ ],
//      color:toColor, 
//      at:"wip"    
//    }
//  });    
//};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

//var doneKanbanDroppedOnEmptyKanban = function(event, ui) {
//  var doneKanban = ui.draggable;
//  var emptyKanban = $(this);
//  var ones = doneKanban.ones();
//  var newValues =  { ones:ones };
//  
  // TODO: what if number of ones being xferred is
  //       greater than size of kanban being dropped on?
  //       What happens to "left-over" 1s?
// 
//  
//  if (emptyKanban.ones().length + ones.length === emptyKanban.size()) {
//    newValues.teamColor = emptyKanban.color();
//    newValues.at = "upstream";
//  }
//  Kanbans.update(emptyKanban.id(), { $set: newValues })  
//  Kanbans.update(doneKanban.id(), { $set: { ones:[ ] } });  
//};

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

$.fn.size = function(/*kanban*/) {
  return $(this).data("size");
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



