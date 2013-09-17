
Template.dashboard.red    = function() { return { gid: this.gid, color: "red"    }; };
Template.dashboard.orange = function() { return { gid: this.gid, color: "orange" }; };
Template.dashboard.blue   = function() { return { gid: this.gid, color: "blue"   }; };
Template.dashboard.green  = function() { return { gid: this.gid, color: "green"  }; };

/*
 * An alternative way to do this is as follows...
 *
 *    Template.dashboard.redTeam = function() {
 *      return Template["edge"]({ gid: gid, color: "red" });  
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