
favicon = function(doc,href) {
 var link = doc.createElement('link');
 link.type = 'image/png';
 link.rel = 'icon';
 link.href = href;
 doc.head = doc.head || doc.getElementsByTagName('head')[0]; 
 doc.head.appendChild(link);
};
