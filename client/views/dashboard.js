
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
  _.each(teamColors(), function(color) {
      setupDragDrop(color);    
  });
  // append ?v=N to force refresh and avoid browser cache
  favIcon(document, 'http://www.jaggersoft.com/AllOnes.png?v=3');
};
