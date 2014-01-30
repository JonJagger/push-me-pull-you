
Router.map(function() { 
  this.route('home', { path: '/',
    data: function() {
      return {
        gid: ""
      }
    }
  });

  this.route('home', { path: '/:gid',
    data: function() {
      return {
        gid: this.params.gid
      }
    }
  });
  
  this.route('team', { path: '/team/:gid/:color',
    data: function() {
      return {
          gid: this.params.gid,
        color: this.params.color
      }
    }
  });

  this.route('dashboard', { path: '/dashboard/:gid',
    data: function() {
      return {
         gid: this.params.gid
      }
    }
  });
  
});
