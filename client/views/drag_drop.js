
setupDragDrop = function(color) {

  dragDropSetup(color,
                ".kanban.pullable",
                ".upstream.portal",
                pullableKanbanDroppedOnUpstreamPortal);

  dragDropSetup(color,
                ".kanban.pushable",
                ".downstream.portal",
                doneKanbanDroppedOnDownstreamPortal);

  dragDropSetup(color,
                ".kanban.pushed",
                ".kanban.pullable",
                pushedKanbanDroppedOnPullableKanban);

  dragDropSetup(color,
                ".kanban.pulled",
                ".kanban.pushable",
                pulledKanbanDroppedOnPushableKanban);
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

var doneKanbanDroppedOnDownstreamPortal = function(event,ui) { // push
  var kanban = ui.draggable; 
  var portal = $(this);
  var downstreamColor = portal.data("to-team");  
  if (kanban.team().color() === 'green') {
    // DONE!
    Kanbans.update(kanban.id(), {
      $set: {
        state: 'pullable',
        size: 0,
        ones: [ ]
      }
    });
  } else {
    Kanbans.update(kanban.id(), {
      $set: {
        teamColor:downstreamColor,
        state: 'pushed'
      }
    });
  }
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var pushedKanbanDroppedOnPullableKanban = function(event,ui) {
  var pushed = ui.draggable;
  var pullable = $(this);  
  Kanbans.update(pullable.id(), {
    $set: {
      state: 'in-progress',
      size: pushed.size(),
      ones: [ ]
    }
  }); 
  Kanbans.update(pushed.id(), {
    $set: {
      teamColor: pushed.color(),
      state: 'pullable',
      size: 0,
      ones: [ ]
    }
  });
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var pulledKanbanDroppedOnPushableKanban = function(event,ui) {
  var pulled = ui.draggable;
  var pushable = $(this);  
  
  if (pulled.size() === pushable.size()) {
    Kanbans.update(pulled.id(), {
      $set: {
        teamColor: pulled.color(),
        state: 'in-progress'
      }
    });
    Kanbans.update(pushable.id(), {
      $set: {
        state: 'pullable',
        size: 0,
        ones: [ ]        
      }
    });
  }
  //TODO: < or >
}

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