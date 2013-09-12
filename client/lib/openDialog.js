
  openDialog = function(title, html) {
    $('<div>')
      .html('<div class="dialog">' + html + '</div>')    
      .dialog({
        buttons: { ok: function() {
          clearStatus();
          $(this).dialog('close'); }
        },
        title: title,
        autoOpen: false,
        modal: true
      }).dialog('open');   
  };

