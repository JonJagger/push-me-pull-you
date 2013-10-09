
favIcon = function(doc,href) {
  var link = doc.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';
  link.href = href;
  link.id = 'favicon';
 
  $("[rel='icon']").remove();
  //doc.head = doc.head || doc.getElementsByTagName('head')[0]; 
  //doc.head.appendChild(link);
  $('<link>', {
    type: 'image/png',
    rel: 'icon',
    href: href,
    id: 'favicon'
  }).appendTo($(doc.head));
};
