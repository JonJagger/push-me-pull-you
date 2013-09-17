
Template.dashboard.red    = function() { return { gid: this.gid, teamColor: "red"    }; };
Template.dashboard.orange = function() { return { gid: this.gid, teamColor: "orange" }; };
Template.dashboard.blue   = function() { return { gid: this.gid, teamColor: "blue"   }; };
Template.dashboard.green  = function() { return { gid: this.gid, teamColor: "green"  }; };

/*
 * An alternative way to do this is as follows...
 *
 *    Template.dashboard.redTeam = function() {
 *      return Template["edge"]({ gid: gid, teamColor: "red" });  
 *    };
 *
 * and then instead of doing this in dashboard.html
 * 
 *    {{> edge red}}
 *    
 * you do this instead
 *
 *    {{readTeam}}
 *    
 */