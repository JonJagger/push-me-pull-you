
Template.dashboard.red    = function() { return { gid:this.gid, color:"red"    }; };
Template.dashboard.orange = function() { return { gid:this.gid, color:"orange" }; };
Template.dashboard.blue   = function() { return { gid:this.gid, color:"blue"   }; };
Template.dashboard.green  = function() { return { gid:this.gid, color:"green"  }; };

/*
 * An alternative way to do this is as follows...
 *
 *    Template.dashboard.redTeam = function() {
 *      return Template["team"]({ gid: gid, color: "red" });  
 *    };
 *
 * and then instead of doing this...
 * 
 *    {{> team red}}
 *    
 * you do this instead...
 *
 *    {{redTeam}}
 *    
 */

Template.dashboard.rendered = function() {  
  var mode = $(".dashboard").data("mode");
  $(".sortable").sortable();    
  _.each(teamColors(), function(color) {
      setupDragDrop(mode, color);    
  });
};
