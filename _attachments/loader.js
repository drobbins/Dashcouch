function app_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  }
}

app_load([ "/_utils/script/sha1.js"
  ,"/_utils/script/json2.js"
  ,"js/jquery-min.js"
  ,"js/jquery.couch.js"
  ,"js/underscore-min.js"
  ,"js/backbone-min.js"
  ,"js/bootstrap.min.js"
  ,"js/jquery-ui.min.js"
  ,"js/underscore-min.js"
  ,"js/d3.min.js"
  ,"js/d3.layout.min.js"
  ,"js/jquery.mustache.js" //my fixed version of mustache.js. Check for updates later.
  ,"js/dashcouch.js"
])
