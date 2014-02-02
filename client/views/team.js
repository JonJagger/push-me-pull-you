
Template.team.rendered = function() {
  var team = $(".team");
  var color = team.color();
  setupDragDrop(color);
  color = color.charAt(0).toUpperCase() + color.slice(1);
  favIcon(document, 'http://www.jaggersoft.com/' + color + 'One.png');
};

