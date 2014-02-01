
$.fn.team = function() {
  return this.closest(".team");
};

$.fn.size = function(/*kanban*/) {
  return parseInt($(this).data('size'));
}

$.fn.id = function(/*kanban*/) {
  return $(this).data("id");  
};

$.fn.color = function(/*kanban*/) {
  var kanban = this;
  return _.find(teamColors(), function(color) {
    return kanban.hasClass(color);
  });
};

$.fn.hasClass = function(klass) {
  return this.attr("class").indexOf(klass) !== -1;
};



