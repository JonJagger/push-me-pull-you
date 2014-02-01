
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

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.team = function() {
  return this.closest(".team");
};

$.fn.size = function(/*kanban*/) {
  return parseInt($(this).data('size'));
}

$.fn.id = function() {
  return $(this).data("id");  
};

$.fn.color = function() {
  var node = this;
  return _.find(teamColors(), function(color) {
    return node.hasClass(color);
  });
};

$.fn.hasClass = function(klass) {
  return this.attr("class").indexOf(klass) !== -1;
};



