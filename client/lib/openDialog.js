
openDialog = function(title, html) {
  $('<div>')
    .html('<div class="dialog">' + html + '</div>')    
    .dialog({
      buttons: { ok: function() {
        $(this).dialog('close'); }
      },
      title: title,
      autoOpen: false,
      modal: true,
      dialogClass: 'noTitle'
    }).dialog('open');   
};

