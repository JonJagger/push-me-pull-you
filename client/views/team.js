
Template.newKanban.count = function() {
  return Kanbans.find({gid:this.gid, teamColor:this.color}).count();
}

Template.newKanban.events({"click input":function() {
  newKanban(this.gid, this.color);
}});

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.wip.kanbans = function() {
  return Kanbans.find({ gid:this.gid, teamColor:this.color });      
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.upstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "backlog";
  if (this.color === "orange") return "red";
  if (this.color === "blue"  ) return "orange";
  if (this.color === "green" ) return "blue";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.downstreamPortal.toColor = function() {
  if (this.color === "red"   ) return "orange";
  if (this.color === "orange") return "blue";
  if (this.color === "blue"  ) return "green";
  if (this.color === "green" ) return "done";
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

Template.team.rendered = function() {
  var team = $(".team");
  var color = team.color();
  setupDragDrop(color);
  
  $('.in-progress.kanban').bind('click keyup', function(event) {
    var kanban = $(this).closest(".kanban");
    var ones   = kanban.ones();
    ones.unshift(kanban.color());
    var state = (ones.length === kanban.size()) ? 'pushable' : 'in-progress';
    Kanbans.update(kanban.id(), {
      $set: {
        state: state,
        ones:ones
      }
    });  
  });
  
  color = color.charAt(0).toUpperCase() + color.slice(1);
  favIcon(document, 'http://www.jaggersoft.com/' + color + 'One.png');
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -

$.fn.hasClass = function(klass) {
  return this.attr("class").indexOf(klass) !== -1;
};

$.fn.team = function() {
  return this.closest(".team");
};

$.fn.size = function(/*kanban*/) {
  return parseInt($(this).data('size'));
}

$.fn.ones = function(/*kanban*/) {  
  var ones = $(this).data("ones");
  // see Template.kanban.onesColors() HACK
  return (ones === ",") ? [ ] : ones.split(",");
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



