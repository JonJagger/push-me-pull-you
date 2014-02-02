
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

  this.route('team', { path: '/red/:gid',
    data: function() { return { gid: this.params.gid, color: 'red' }}
  });

  this.route('team', { path: '/orange/:gid',
    data: function() { return { gid: this.params.gid, color: 'orange' }}
  });

  this.route('team', { path: '/blue/:gid',
    data: function() { return { gid: this.params.gid, color: 'blue' }}
  });

  this.route('team', { path: '/green/:gid',
    data: function() { return { gid: this.params.gid, color: 'green' }}
  });

  this.route('dashboard', { path: '/dashboard/:gid',
    data: function() {
      return {
         gid: this.params.gid
      }
    }
  });
  
});
