
Router.configure({
  layout: 'layout',
  renderTemplates: {
    'statusBar': { to: 'statusBar' }
  }
});

Router.map(function() { 
  this.route('home', { path: '/' });
  
  this.route('edge', {
    path: '/edge/:gid/:teamColor',
    data: function() {
      return {
        gid: this.params.gid,
        teamColor: this.params.teamColor
      }
    }
  });
  
});
