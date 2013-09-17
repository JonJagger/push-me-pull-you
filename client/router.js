
Router.map(function() { 
  this.route('home', { path: '/' });
  
  this.route('team', {
    path: '/team/:gid/:teamColor',
    data: function() {
      return {
        gid: this.params.gid,
        teamColor: this.params.teamColor
      }
    }
  });

  this.route('dashboard', {
    path: '/dashboard/:gid',
    data: function() { return { gid: this.params.gid } }
  });
  
});
