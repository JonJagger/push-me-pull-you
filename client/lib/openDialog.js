
openDialog = function(html) {
  $("<div>")
    .html("<div class='dialog'>" + html + "</div>")    
    .dialog({
      buttons: { ok: function() {
        $(this).dialog("close"); }
      },
      autoOpen: false,
      modal: true,
      dialogClass: "noTitle"
    }).dialog("open");   
};

