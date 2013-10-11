
favIcon = function(doc,href) { 
  $("[rel='icon']").remove();
  $('<link>', {
    type: 'image/png',
    rel: 'icon',
    href: href,
    id: 'favicon'
  }).appendTo($(doc.head));
};
