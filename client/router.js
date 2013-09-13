
Router.configure({
  layout: 'layout',
  renderTemplates: {
    'statusBar': { to: 'statusBar' }
  }
});

Router.map(function() { 
  this.route('home', {path: '/'});
  
  this.route('edge', {
    path: '/edge/:gid/:color',
    data: function() {
      return {
        gid: this.params.gid,
        color: this.params.color
      }
    }
  });
  
});
