
Template.team.rendered = function() {
  var team = $(".team");
  var color = team.color();
  setupDragDrop(color);
  
  $('.in-progress.kanban').bind('click keyup', function(event) {
    var kanban = $(this).closest(".kanban");
    Kanbans.update(kanban.id(), {
      $set: {
        state: 'pushable'
      }
    });  
  });
  
  color = color.charAt(0).toUpperCase() + color.slice(1);
  favIcon(document, 'http://www.jaggersoft.com/' + color + 'One.png');
};

