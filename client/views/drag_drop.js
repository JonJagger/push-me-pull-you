
setupDragDrop = function(color) {

  dragDropSetup(color,
                ".kanban.pullable",
                ".upstream.portal",
                pullableKanbanDroppedOnUpstreamPortal);

  dragDropSetup(color,
                ".kanban.pushable",
                ".downstream.portal",
                doneKanbanDroppedOnDownstreamPortal);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var pullableKanbanDroppedOnUpstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
    
  if (kanban.team().color() === 'red') {
    // simulate instant response from infinite backlog
    Kanbans.update(kanban.id(), {
      $set: {
        state: 'in-progress',
        size: 3, //slimed
        ones: [ ]
      }
    });    
  } else {
    Kanbans.update(kanban.id(), {
      $set: {
        teamColor: portal.data('to-team'),
        state: 'pulled',
        size: 3, //slimed
        ones: [ ]
      }
    });
  }  
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneKanbanDroppedOnDownstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  var downstreamColor = portal.data("to-team");
  Kanbans.update(kanban.id(), { // push
    $set: {
      teamColor:downstreamColor,
      state: 'pushed'
    }
  });
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

var nOnes = function(n) { // eg 3
  return _(n).times(function() { return 1; });  // eg [1,1,1]
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

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

//dragDropSetup(color,
//              ".upstream.portal .kanban.is-done",
//              ".wip",
//              doneKanbanDroppedOnWip);
//
//var doneKanbanDroppedOnWip = function(event, ui) {
//  var kanban = ui.draggable; 
//  var wip    = $(this);
//  var toColor = wip.team().color();
//  Kanbans.update(kanban.id(), { 
//    $set: {
//      ones:[ ],
//      color:toColor
//      at:"wip"    
//    }
//  });    
//};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

//dragDropSetup(color,
//              ".kanban.is-done",
//              ".downstream.portal .kanban",
//              doneKanbanDroppedOnEmptyKanban);
//
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



