
setupDragDrop = function(color) {

  dragDropSetup(color,
                '.kanban.pullable',
                '.upstream.portal',
                pullableKanbanDroppedOnUpstreamPortal);

  dragDropSetup(color,
                '.kanban.pushable',
                '.downstream.portal',
                doneKanbanDroppedOnDownstreamPortal);

  dragDropSetup(color,
                '.kanban.pushed',
                '.kanban.pullable',
                pushedKanbanDroppedOnPullableKanban);

  dragDropSetup2(color,
                '.kanban.pulled',
                '.kanban.pushable',
                pulledKanbanDroppedOnPushableKanban);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var getSize = function(f) {
  $('<div>').dialog({	  
      title: "size?",
      autoOpen: false,
      width: 650,
      modal: true,
      buttons: {
        1: function() { f(1); $(this).dialog('close'); },
        2: function() { f(2); $(this).dialog('close'); },
        3: function() { f(3); $(this).dialog('close'); },
        4: function() { f(4); $(this).dialog('close'); },
        5: function() { f(5); $(this).dialog('close'); },
        6: function() { f(6); $(this).dialog('close'); }
      }
    }).dialog('open');
}

var pullableKanbanDroppedOnUpstreamPortal = function(event,ui) {
  var kanban = ui.draggable; 
  var portal = $(this);
  getSize(function(size) {
    if (kanban.team().color() === 'red') {
      // simulate instant response from infinite backlog
      Kanbans.update(kanban.id(), {
        $set: {
          state: 'pushable',
          size: size
        }
      });    
    } else {
      Kanbans.update(kanban.id(), {
        $set: {
          teamColor: portal.data('to-team'),
          state: 'pulled',
          size: size
        }
      });
    }
  });
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var doneKanbanDroppedOnDownstreamPortal = function(event,ui) { // push
  var kanban = ui.draggable; 
  var portal = $(this);
  var downstreamColor = portal.data("to-team");  
  if (kanban.team().color() === 'green') {
    Kanbans.update(kanban.id(), { // DONE!
      $set: {
        state: 'pullable',
        size: 0
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
      state: 'pushable',
      size: pushed.size()
    }
  }); 
  Kanbans.update(pushed.id(), {
    $set: {
      teamColor: pushed.color(),
      state: 'pullable',
      size: 0
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
        state: 'pushable'
      }
    });
    Kanbans.update(pushable.id(), {
      $set: {
        state: 'pullable',
        size: 0
      }
    });
  }
  //TODO: < or >
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

var dragDropSetup = function(color,from,to,handler) {
  var dragDrop = function(css) {
    return $('.'+color + '.team' + " " + css);
  };
  var tos = dragDrop(to);
  dragDrop(from).draggable({
    start:function() {
      tos.addClass('droppable')
         .droppable({ drop:handler });      
    },
    stop:function() {
      tos.removeClass('droppable');
    },
    revert:true,
    revertDuration:0,
    opacity:0.75,
    zIndex:100
  });
};

var dragDropSetup2 = function(color,from,to,handler) {
  
  var dragDrop = function(css,size) {
    return $('.'+color + '.team' + " " + css + '[data-size="' + size + '"]');
  };  
  var dragDropI = function(css,size,i) {    
    var froms = dragDrop(from,i);
    var tos = dragDrop(to,i);
    if (froms.length > 0 && tos.length > 0) {
      froms.draggable({
        start:function() {
          log("DDI:start");
          tos.addClass('droppable')
             .droppable({ drop:handler });      
        },
        stop:function() {
          tos.removeClass('droppable');
        },
        revert:true,
        revertDuration:0,
        opacity:0.75,
        zIndex:100
      });
    }    
  };

  for (var i = 1; i <= 6; i++) {
    dragDropI(from,to,i);
  }
};
