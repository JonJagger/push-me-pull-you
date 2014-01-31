
openDialog = function(html) {
  $("<div>")
    .html(html)    
    .dialog({
      buttons: {
        ok: function() {
          $(this).dialog("close"); }
        },
      modal: true,
      dialogClass: "no-title"
    }).dialog("open");   
};

